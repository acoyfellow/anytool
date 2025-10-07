to be able to run arbitrary code in a worker, we need to be able to:
- prompt an LLM to generate code
- be able to dynamically or statically import code into the worker via npm / unpkg / etc
- bundle the final output into r2
- send that final output into a worker loader/isolate to be executed.