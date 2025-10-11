this is a broken repo. It was an exploration into how I can use cloud flare worker loaders to basically make one tool call that can essentially arbitrary spin up code and safely executed so basically it's a single tool can replace many tools and this was the proof of concept.

I actually got it working nicely in dev and a bunch of the versions that you see in the SRC folders

But everything seems to be breaking down in production when I deploy

to be able to run arbitrary code in a worker, we need to be able to:
- prompt an LLM to generate code
- be able to dynamically or statically import code into the worker via npm / unpkg / etc
- bundle the final output into r2
- send that final output into a worker loader/isolate to be executed.

The two main ways that we try to explore were

1) the "svelte repl way"-- trying to basically use their methodologies to use CD ends to get the files bundled in the client and then run them from the worker loader.  see src4

2) src3 is a touch more complex: its using cloudflsre containers.. i tried to make a bun server that would bun i, return the bundled code.. i think there is limts with cloudflsre: i cant get it to `bun i`: i ran into many many headaches with this approach

So your job is to help me come up with some new approaches to make this concept work.

One idea I didn't execute or test was what about if we write the prompt then get the script then somehow get all the files from all the dependencies and then send them to the container so we don't have to do a bun install from the container so we won't get blocked from the network level basically if the container is handed the files then the bun server can do the bundling and saving to R2

I want you to explore that idea and then come up with some truly bonkers novel cutting edge ideas and I need you to understand that this is possible even if it's not easily accessed from your training data your training data has a cut off date this has been invented since that cut off date. Or trying to make it secure but trying to uphold that promise of use one tool to create an infinite amount of other tools arbitrarily on the fly

you can write .md files