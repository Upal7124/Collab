export function matchProfiles(userA, userB) {
  const A_learn = userA.learn || [];
  const A_teach = userA.teach || [];
  const B_learn = userB.learn || [];
  const B_teach = userB.teach || [];

  // STEP 1: What A can learn from B
  const A_can_learn_from_B = A_learn.filter(skill => B_teach.includes(skill));

  // STEP 2: What B can learn from A
  const B_can_learn_from_A = B_learn.filter(skill => A_teach.includes(skill));

  // STEP 3: Check if mutual learning is possible
  if (A_can_learn_from_B.length === 0 || B_can_learn_from_A.length === 0) {
    return {
      matchFound: false,
      A_can_learn_from_B: [],
      B_can_learn_from_A: [],
      matchScore: 0
    };
  }

  // STEP 4: Match score
  const scoreA = (A_can_learn_from_B.length / A_learn.length) * 50;
  const scoreB = (B_can_learn_from_A.length / B_learn.length) * 50;

  return {
    matchFound: true,
    A_can_learn_from_B,
    B_can_learn_from_A,
    matchScore: Math.round(scoreA + scoreB)
  };
}
