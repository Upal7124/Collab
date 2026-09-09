export function matchProfiles(userA, userB) {
  const A_learn = userA.learn || [];
  const A_teach = userA.teach || [];
  const B_learn = userB.learn || [];
  const B_teach = userB.teach || [];

  const A_can_learn_from_B = A_learn.filter(skill => B_teach.includes(skill));

  const B_can_learn_from_A = B_learn.filter(skill => A_teach.includes(skill));

  if (A_can_learn_from_B.length === 0 || B_can_learn_from_A.length === 0) {
    return {
      matchFound: false,
      A_can_learn_from_B: [],
      B_can_learn_from_A: [],
      matchScore: 0
    };
  }

  const scoreA = (A_can_learn_from_B.length / A_learn.length) * 50;
  const scoreB = (B_can_learn_from_A.length / B_learn.length) * 50;

  return {
    matchFound: true,
    A_can_learn_from_B,
    B_can_learn_from_A,
    matchScore: Math.round(scoreA + scoreB)
  };
}
