const Thread = require("threads");

function trial(L, D) {
  // boards are parallel to the y axis. so it becomes a vertical line test.
  // the needle is a line from A to B with length L

  // assert precondition
  if (!(D >= L)) {
    throw new Error("D must be >= L");
  }

  // let our scale be +- 10 board widths to make the results interesting
  const scale = 10 * D;

  // first we generate a random point A and a random slope m
  const Ax = Math.random() * scale;
  const m = Math.random();

  // then we solve the triangle to find B from L
  // we know the hypotenuse and the slope, need to calculate opp and adj sides
  // we can shortcut because we only need to know Bx, not B
  const theta = 2 * Math.PI * m;
  // by law of cosines, ratio between hypotenuse and adjacent side is cosine theta
  const Δx = Math.cos(theta) * L;
  const Bx = Ax + Δx;

  // by Intermediate Value Theorem, we pass the vertical line test if  Ax < Dn < Bx for any n in N
  // console.log(Ax, "\t", Bx);

  if (Ax === Bx) {
    // if it's a vertical line, only pass if Ax = Dn for some n in N
    return Ax % D === 0;
  }

  // naive iterate board widths, can be improved
  // it doesn't matter which end of the line is A or B as long as the length is L
  const D2 = 2 * D;
  const ax = Ax % D2;
  const bx = Bx % D2;

  // mod 2 D to check if D is in the middle, checking either order
  return (ax < D && D < bx) || (bx < D && D < ax);
}

function trials(L, D, trials) {
  const result = { pass: 0, fail: 0 };
  for (let t = 0; t < trials; t++) {
    if (trial(L, D)) {
      result.pass++;
    } else {
      result.fail++;
    }
  }

  return result;
}

Thread.expose(trials);
