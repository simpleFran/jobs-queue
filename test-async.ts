// a function that simulate a slow asynchronous operation (like fetching data from a db or await an API )
// It returns a promise that resolves after a X milliseconds delay

function awaitSeconds(seconds: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000); //convert seconds to miliseconds
  });
}

// our main function with 'async' keyword that will be executed to be used 'await'

async function runTest(){
    console.log("1. 🚀 Starting process...");

    console.log("2. ⏳ Waiting 3 seconds...");
    await awaitSeconds(3); // wait 3 seconds

    console.log("3. Fineshed operation after 3 second!");
    console.log("4. Process completed!");
}


runTest();