export function testFunctionPerformance(benchmarkName, functionToCall) {
  const start = performance.now();
  functionToCall();
  const finish = performance.now();

  const timeElapsed = finish - start;

  console.log(`${benchmarkName} took ${timeElapsed}ms to run.`);
}
