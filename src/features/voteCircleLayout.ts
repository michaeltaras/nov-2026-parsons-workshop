import {
  forceCollide,
  forceSimulation,
  forceX,
  forceY,
  randomLcg,
  scaleSqrt,
} from "d3";

export interface VoteCircleAnchor {
  fips: string;
  x: number;
  y: number;
  votes: number;
}

interface VoteCircleNode extends VoteCircleAnchor {
  anchorX: number;
  anchorY: number;
  radius: number;
}

// Area, not radius, is proportional to candidate votes. This fixed reference is
// also used by the size legend, so changing counties never silently rescales it.
export const voteCircleRadius = scaleSqrt<number, number>()
  .domain([0, 500000])
  .range([0, 34]);

export function createVoteCircleLayout(anchors: VoteCircleAnchor[]) {
  const nodes: VoteCircleNode[] = anchors.map((anchor) => ({
    ...anchor,
    anchorX: anchor.x,
    anchorY: anchor.y,
    radius: voteCircleRadius(anchor.votes),
  }));
  // A static, seeded layout separates dense NYC symbols without animation or
  // inflated minimum circle sizes. Lines show displacement from the map centroid.
  const simulation = forceSimulation(nodes)
    .randomSource(randomLcg(0.42))
    .force("x", forceX<VoteCircleNode>((node) => node.anchorX).strength(0.25))
    .force("y", forceY<VoteCircleNode>((node) => node.anchorY).strength(0.25))
    .force(
      "collide",
      forceCollide<VoteCircleNode>((node) => node.radius + 2).iterations(3),
    )
    .stop();
  for (let tick = 0; tick < 240; tick++) {
    simulation.tick();
    for (const node of nodes) {
      node.x = Math.max(node.radius + 10, Math.min(800 - node.radius, node.x));
      node.y = Math.max(node.radius + 10, Math.min(486 - node.radius, node.y));
    }
  }
  return nodes;
}
