const Thread = require("threads");
/*
Approximating π by simulation

In 1733 the French naturalist Georges Louis Leclerc, Comte de Buffon, posed and
solved the following problem in geometric probability: when a needle of length L is
dropped onto a wooden floor constructed from boards of width D (where D ≥ L),
what is the probability that it will lie across a seam between two boards?
Buffon determined that the probability is 2L/Dπ.
via https://www.maa.org/sites/default/files/s1000042.pdf

Can try to simulate this geometrically by trials of a random drop angle and origin and checking for
intersections of board lines
*/

async function simulate(trials = 10) {
  const L = 5;
  const D = 10;

  let pass = 0;

  const Progress = require("progress");
  const progress = new Progress(
    `π :π  e :e :percent  :curr ------- :rate :elapsed : :eta`,
    {
      total: trials,
      renderThrottle: 100
    }
  );

  let i = 0;
  let remaining = trials;
  const pool = Thread.Pool(() => Thread.spawn(new Thread.Worker("./trial")));

  function pump() {
    pool.queue(async doTrials => {
      const chunkSize = 100000;

      const r = await doTrials(L, D, chunkSize);
      i += chunkSize;
      trials -= chunkSize;

      pass += r.pass;
      const p = pass / (i + 1);
      const π = (2 * L) / (D * p);
      const e = π - Math.PI;

      progress.tick(chunkSize, {
        pass,
        curr: i.toLocaleString(),
        π: π.toFixed(20),
        e: e.toFixed(20)
      });

      if (trials > 0) {
        pump();
      }
    });
  }

  for (let thread = 0; thread < 4; thread++) {
    pump();
  }

  /*
    Buffon's needle formula is p = 2L/Dπ
    We simulated p, so we can solve for π:
    π = 2L/Dp
  */
  const p = pass / trials;
  const π = (2 * L) / (D * p);

  return { trials, p, π, e: Math.PI - π };
}

simulate(1e10).then(console.log.bind.console, console.log.bind.console);
