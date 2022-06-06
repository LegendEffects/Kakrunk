# Kakrunk

It's like kahoot, but it'll krunk with you honey.

**Do not use this as a perfect example of how to use Cloudflare Workers / Durable Objects**

There are many things that I wish I had done while building this, one of which being giving myself more time.

## What went well

The initial standup of the project was fairly painless, getting websockets connected and working was simple using Cloudflare's Durable Objects; this was my first time using XState so there's likely some issues with how I architected it and how I'm interacting with XState as a whole.

Unfortunately time isn't something I have much of so couldn't persue my wider ideas.

## Even better if
* **Sound Effects** - waiting room music etc (I was likely going to use the Secret of Monkey Island theme)
* **Quiz Creation** - being able to create quizzes with authentication being handled through an external oauth provider
* **Powerups** - just to make the game a bit more interesting
* **Quiz Options** - allowing the host to change how to host the quiz
* **Podium** - showing players their final standing in the game

## Development

Simply run `yarn dev` in both the `worker` and `client` directories