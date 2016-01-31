//slackbot token
if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}
//firebase secret
if (!process.env.secret) {
    console.log('Error: Specify secret in environment');
    process.exit(1);
}
//slack channel id
if (!process.env.channelid) {
    console.log('Error: Specify channelid in environment');
    process.exit(1);
}

!(function () {

	var Botkit = require('./lib/Botkit.js'),
	    os = require('os'),
	    http = require('http'),
	    request = require('request'),
	    Firebase = require('firebase');

	var controller = Botkit.slackbot({
	    debug: false,
	});

	var bot = controller.spawn({
	    token: process.env.token
	}).startRTM();

	//later to be hadled through firebase
	var exercises = {
		fullBody: [
			{
				name:"Inchworm",
				description:"Stand up tall with the legs straight, and do like Lil’ Jon and let those fingertips hit the floor. Keeping the legs straight (but not locked!), slowly lower the torso toward the floor, and then walk the hands forward. Once in a push-up position, start taking tiny steps so the feet meet the hands. Continue bugging out for XXX times",
				type: "count",
				range: "4-6",
				increments: 1
			},{
				name:"Tuck Jump",
				description:"Standing with the knees slightly bent, jump up as high as possible (pretend Chuck Norris is watching!) and bring the knees in toward the chest while extending the arms straight out. Land with the knees slightly bent and quickly jump (on it) again!",
				type: "count",
				range: "4-6",
				increments: 1
			},{
				name:"Bear Crawl",
				description:"Embrace that inner grizzly. Starting on the hands and knees, rise up onto the toes, tighten the core, and slowly reach forward with the right arm and right knee, followed by the left side. Continue the crawl for XXX steps (or until you scare your coworkers off).",
				type: "count",
				range: "8-10",
				increments: 2
			},{
				name:"Mountain Climber",
				description:"Starting on your hands and knees, bring the left foot forward directly under the chest while straightening the right leg. Keeping the hands on the ground and core tight, jump and switch legs. The left leg should now be extended behind the body with the right knee forward.",
				type: "count",
				range: "8-10",
				increments: 2
			},{
				name:"Plyometric Push-Up",
				description:"Start on a well-padded surface and complete a traditional push-up. Then, in an explosive motion, push up hard enough to come off the floor (and hang ten for a second!). Once back on solid ground, immediately head into the next repetition.",
				type: "count",
				range: "4-6",
				increments: 1
			},{
				name:"Prone Walkout",
				description:"Beginning on all fours with the core engaged, slowly walk the hands forward, staying on the toes but not moving them forward. Next, gradually walk the hands backwards to the starting position, maintain stability and balance.",
				type: "count",
				range: "4-6",
				increments: 1
			},{
				name:"Burpees",
				description:"One of the most effective full-body exercises around, this one starts out in a low squat position with hands on the floor. Next, kick the feet back to a push-up position, complete one push-up, then immediately return the feet to the squat position. Leap up as high as possible before squatting and moving back into the push-up portion.",
				type: "count",
				range: "10-6",
				increments: 2
			},{
				name:"Plank",
				description:"Lie face down with forearms on the floor and hands clasped. Extend the legs behind the body and rise up on the toes. Keeping the back straight, tighten the core and hold the position for XXX seconds (or as long as you can hang).",
				type: "time",
				range: "30-60",
				increments: 10
			},{
				name:"Plank-to-Push-Up",
				description:"Starting in a plank position, place down one hand at a time to lift up into a push-up position, with the back straight and the core engaged. Then move one arm at a time back into the plank position (forearms on the ground). Repeat, alternating the arm that makes the first move.",
				type: "count",
				range: "6-8",
				increments: 2
			}
		],
		legs: [
			{
				name:"Wall Sit",
				description:"Slowly slide your back down a wall until the thighs are parallel to the ground. Make sure the knees are directly above the ankles and keep the back straight. Go for XXX seconds per set (or however long it takes to turn those legs to jelly). Need more fire? Add some bicep curls.",
				type: "time",
				range: "50-70",
				increments: 10
			},{
				name:"Lunge",
				description:"Stand with the hands on the hips and feet hip-width apart. Step your right leg forward and slowly lower body until left (back) knee is close to or touching the floor and bent at least 90 degrees. Return to the starting position and repeat on the other side. Try stepping back into the lunge for a different variation.",
				type: "count",
				range: "10-14",
				increments: 2
			},{
				name:"Lunge Jump",
				description:"Ready to impress some friends? Stand with the feet together and lunge forward with the right foot. Jump straight up, propelling the arms forward while keeping the elbows bent. While in the air, switch legs and land in a lunge with the opposite leg forward. Repeat and continue switching legs. Try to do XXX!",
				type: "count",
				range: "6-10",
				increments: 2
			},{
				name:"Curtsy Lunge",
				description:"Let’s show a little respect. When lunging, step the left leg back behind the right, bending the knees and lowering the hips until the right thigh is almost parallel to the floor. Remember to keep the torso upright and the hips square.",
				type: "count",
				range: "6-10",
				increments: 2
			},{
				name:"Squat",
				description:"Stand with the feet parallel or turned out 15 degrees—whatever is most comfortable. Slowly start to crouch by bending the hips and knees until the thighs are at least parallel to the floor. Make sure the heels do not rise off the floor. Press through the heels to return to a standing position.",
				type: "count",
				range: "6-10",
				increments: 2
			},{
				name:"Stairs",
				description:"Run all the way to the 6th floor and back XXX times.",
				type: "count",
				range: "1-1",
				increments: 1
			},{
				name:"Single Leg Deadlift",
				description:"Start in a standing position with the feet together. Lift the right leg slightly, and lower the arms and torso while raising the right leg behind the body. Keep the left knee slightly bent and reach the arms as close to the floor as possible. Raise the torso while lowering the right leg. Switch legs.",
				type: "count",
				range: "6-8",
				increments: 2
			},{
				name:"Squat Reach and Jump",
				description:"Perform a normal squat, but immediately jump up, reaching the arms straight overhead. Aim for 15 reps, taking a quick breather before the next set.",
				type: "count",
				range: "12-16",
				increments: 2
			},{
				name:"Chair Squat Pose",
				description:"Stand with the feet hip-distance apart and squat until the thighs are parallel to the floor while swinging the arms up. Straighten the legs, then lift up the right knee while swinging the left arm outside the right knee. Return to standing and repeat on the other side.",
				type: "count",
				range: "12-16",
				increments: 2
			},{
				name:"Quadruped Leg Lift",
				description:"Starting on the hands and knees, keep a flat back and engage the core. Raise the left leg straight back, stopping when the foot is hip-level and the thigh parallel to the floor. Balance for as long as possible, then raise the bottom right toe off the floor, tightening the butt, back, and abs (try to be graceful here!). Hold for up to 10 seconds, then switch legs.",
				type: "count",
				range: "6-8",
				increments: 2
			},{
				name:"Step-Up",
				description:"Find a step or bench, and place the right foot on the elevated surface. Step up until the right leg is straight (do it for Chuck!), then return to start. Repeat, aiming for XXX times on each side.",
				type: "count",
				range: "10-12",
				increments: 2
			},{
				name:"Calf Raise",
				description:"From a standing position, slowly rise up on the toes, keeping the knees straight and heels off the floor. Hold briefly, then come back down. Aaaand repeat. Try standing on something elevated (like a step) to achieve a wider range of motion.",
				type: "count",
				range: "10-12",
				increments: 2
			}
		],
		chestAndBack:[
			{
				name:"Standard Push-Up",
				description:"With hands shoulder-width apart, keep the feet flexed at hip distance, and tighten the core. Bend the elbows until the chest reaches the ground, and then push back up (make sure to keep the elbows tucked close to the body).",
				type: "count",
				range: "6-10",
				increments: 1
			},{
				name:"Dolphin Push-Up",
				description:"Start out in dolphin pose (think: down-dog with elbows on the floor). Lean forward, lowering the shoulders until the head is over the hands. Pull up the arms and return to the starting position.",
				type: "count",
				range: "6-10",
				increments: 1
			},{
				name:"Contralateral Limb Raises",
				description:"Lie on your stomach with the arms outstretched and palms facing one another. Slowly lift one arm a few inches off the floor, keeping it straight without rotating the shoulders and keeping the head and torso still. Hold the position, then lower the arm back down, moving to the other arm.",
				type: "count",
				range: "6-10",
				increments: 1
			},{
				name:"Donkey Kick",
				description:"Start in a push-up position, with the legs together. Tighten the core and kick both legs into the air with knees bent, reaching the feet back toward the glutes. Just try to land gently when reversing back to the starting position.",
				type: "count",
				range: "6-10",
				increments: 1
			},{
				name:"Handstand Push-Up",
				description:"Fair warning: This move is for the pros. Get set in a headstand position against a wall and bend the elbows at a 90-degree angle, doing an upside down push-up (so the head moves toward the floor and the legs remain against the wall). First timer? Grab a friend to spot you—safety first!",
				type: "count",
				range: "4-6",
				increments: 1
			},{
				name:"Judo Push-up",
				description:"From a push-up position, raise up those hips and in one swift movement (Hai-yah!) use the arms to lower the front of the body until the chin comes close to the floor. Swoop the head and shoulders upward and lower the hips, keeping the knees off the ground. Reverse the move to come back to the raised-hip position. Try to repeat for XXX seconds.",
				type: "time",
				range: "30-60",
				increments: 10
			},{
				name:"Superman",
				description:"Lie face down with arms and legs extended. Keeping the torso as still as possible, simultaneously raise the arms and legs to form a small curve in the body. Cape optional.",
				type: "time",
				range: "30-60",
				increments: 10
			}
		],
		shouldersAndArms:[
			{
				name:"Triceps Dip",
				description:"Get seated near a step or bench. Sit on the floor with knees slightly bent, and grab the edge of the elevated surface and straighten the arms. Bend them to a 90-degree angle, and straighten again while the heels push towards the floor. For some extra fire, reach the right arm out while lifting the left leg.",
				type: "time",
				range: "30-60",
				increments: 10
			},{
				name:"Diamond Push-Up",
				description:"Jay-Z would approve. These push-ups get pimped out with a diamond-shaped hand position (situate them so that the thumbs and index fingers touch). This hand readjustment will give those triceps some extra (burning) love.",
				type: "count",
				range: "4-6",
				increments: 1
			},{
				name:"Boxer",
				description:"Starting with feet hip-width apart and knees bent, keep the elbows in and extend one arm forward and the other arm back. Hug the arms back in and switch arms—like you’re in the ring!",
				type: "count",
				range: "14-18",
				increments: 3
			},{
				name:"Shoulder Stabilization Series (I, Y, T, W O)",
				description:"OK, it may look crazy, but stay with me. Lie down on your stomach with arms extended overhead and palms facing each other. Move the arms into each letter formation. (Gimme a Y, you know you want to!).",
				type: "count",
				range: "10-12",
				increments: 2
			},{
				name:"Arm Circles",
				description:"Remember P.E. class? Stand with arms extended by the sides, perpendicular to the torso. Slowly make clockwise circles for about twenty to thirty seconds (about one foot in diameter). Then reverse the movement, going counter-clockwise.",
				type: "count",
				range: "10-12",
				increments: 2
			}
		],
		core:[
			{
				name:"L Seat",
				description:"Seated with the legs extended and feet flexed, place the hands on the floor and slightly round the torso. Then, lift the hips off the ground, hold for five seconds and release. Repeat!",
				type: "count",
				range: "8-10",
				increments: 1
			},{
				name:"Rotational Push-Up",
				description:"Standard push-ups not cutting it? For a variation, after coming back up into a starting push-up position, rotate the body to the right and extend the right hand overhead, forming a T with the arms and torso. Return to the starting position, do a normal push-up, then rotate to the left.",
				type: "count",
				range: "6-8",
				increments: 1
			},{
				name:"Flutter Kick",
				description:"Start lying on your back with arms at your sides and palms facing down. With legs extended, lift the heels off the floor (about six inches). Make quick, small up-and-down pulses with the legs, while keeping the core engaged. Try to keep kickin’ it for a XXXseconds straight!",
				type: "time",
				range: "30-60",
				increments: 10
			},{
				name:"Dynamic Prone Plank",
				description:"Starting in a standard plank position, raise the hips as high as they can go, then lower them back down. Continue this movement XXXs. Make sure the back stays straight and the hips don’t droop.",
				type: "time",
				range: "30-60",
				increments: 10
			},{
				name:"Side Plank",
				description:"Roll to the side and come up on one foot and elbow. Make sure the hips are lifted and the core is engaged, and hang tight for XXX seconds (or as long as you can stomach!).",
				type: "time",
				range: "30-60",
				increments: 10
			},{
				name:"Russian Twist",
				description:"Sit on the floor with knees bent and feet together, lifted a few inches off the floor. With the back at a 45-degree angle from the ground, move the arms from one side to another in a twisting motion. Here, slow and steady wins the race: The slower the twist, the deeper the burn.",
				type: "count",
				range: "10-14",
				increments: 2
			},{
				name:"Bicycle",
				description:"Lie down with knees bent and hands behind the head. With the knees in toward the chest, bring the right elbow towards the left knee as the right leg straightens. Continue alternating sides (like you’re pedaling!).",
				type: "count",
				range: "14-24",
				increments: 4
			},{
				name:"Crunch",
				description:"Lie on your back with the knees bent and feet flat on the floor. With hands behind the head, place the chin down slightly and peel the head and shoulders off the mat while engaging the core. Continue curling up until the upper back is off the mat. Hold briefly, then lower the torso back toward the mat slowly.",
				type: "count",
				range: "12-16",
				increments: 2
			},{
				name:"Segmental Rotation",
				description:"Lie on your back with the knees bent and feet hip-width apart. Place arms at your side and lift up the spine and hips. Only the head, feet, arms, and shoulders should be on the ground. Then lift one leg upwards, keeping the core tight. Slowly bring the leg back down, then lift back up. Try to do XXX reps per leg, then bring the knee in place and spine back on the floor.",
				type: "count",
				range: "6-10",
				increments: 1
			},{
				name:"Single Leg Abdominal Press",
				description:"Lie on your back with the knees bent and feet on the floor. Tighten the abs and raise the right leg, with the knee and hip bent at a 90-degree angle. Push the right hand on top of the lifted knee, using the core to create pressure between the hand and knee. Hold for five counts, and then lower back down to repeat with the left hand and knee.",
				type: "count",
				range: "6-10",
				increments: 1
			},{
				name:"Double Leg Abdominal Press",
				description:"Lie on your back with the knees bent and feet on the floor. Tighten the abs and raise both legs, with the knees and hip bent at a 90-degree angle. Push  hands on top of the knees, using the core to create pressure between the hand and knee. Hold for five counts, and then lower back down to repeat with the left hand and knee.",
				type: "count",
				range: "6-10",
				increments: 1
			},{
				name:"Sprinter Sit-Up",
				description:"Lie on your back with the legs straight and arms by your side—elbows bent at a 90-degree angle. Now sit up, bringing the left knee toward the right elbow. Lower the body and repeat on the other side.",
				type: "count",
				range: "6-10",
				increments: 1
			}
		],
		fun:[
			{
				name:"Get a drink.",
				description:"Just walk into the kitchen and grab a water, tea, coffee or beer!",
				type: "count",
				range: "1-1",
				increments: 1
			},{
				name:"Take a nap.",
				description:"Just walk into the kitchen and grab a water, tea or coffee!",
				type: "time",
				range: "60-120",
				increments: 60
			}
		];
	},
	funChuckFacts = [
		"There used to be a street named after Chuck Norris, but it was changed because nobody crosses Chuck Norris and lives.",
		"Chuck Norris has already been to Mars; that's why there are no signs of life.",
		"Chuck Norris died 20 years ago, Death just hasn't built up the courage to tell him yet.",
		"Fear of spiders is aracnaphobia, fear of tight spaces is chlaustraphobia, fear of Chuck Norris is called Logic",
		"Chuck Norris and Superman once fought each other on a bet. The loser had to start wearing his underwear on the outside of his pants.",
		"Some magicans can walk on water, Chuck Norris can swim through land.",
		"Chuck Norris counted to infinity - twice.",
		"Chuck Norris is the reason why Waldo is hiding.",
		"Chuck Norris once urinated in a semi truck's gas tank as a joke....that truck is now known as Optimus Prime.",
		"Death once had a near-Chuck Norris experience",
		"When the Boogeyman goes to sleep every night, he checks his closet for Chuck Norris.",
		"Chuck Norris can slam a revolving door.",
		"Chuck Norris doesn't flush the toilet, he scares the sh*t out of it",
		"Chuck Norris once kicked a horse in the chin. Its descendants are known today as Giraffes.",
		"Chuck Norris can win a game of Connect Four in only three moves.",
		"Chuck Norris can cut through a hot knife with butter",
		"Chuck Norris will never have a heart attack. His heart isn't nearly foolish enough to attack him.",
		"Chuck Norris once got bit by a rattle snake........ After three days of pain and agony ..................the rattle snake died",
		"There is no theory of evolution. Just a list of animals Chuck Norris allows to live.",
		"When Chuck Norris does a pushup, he isn't lifting himself up, he's pushing the Earth down.",
		"Chuck Norris doesn’t wear a watch. HE decides what time it is.",
		"The original title for Alien vs. Predator was Alien and Predator vs Chuck Norris.",
		"The film was cancelled shortly after going into preproduction. No one would pay nine dollars to see a movie fourteen seconds long.",
		"Chuck Norris can light a fire by rubbing two ice-cubes together.",
		"Chuck Norris doesn't read books. He stares them down until he gets the information he wants.",
		"Chuck Norris made a Happy Meal cry.",
		"Chuck Norris can kill 2 stones with 1 bird.",
		"When Chuck Norris was born, the only person who cried was the doctor. Never slap Chuck Norris.",
		"Some people wear Superman pajamas. Superman wears Chuck Norris pajamas.",
		"Chuck Norris is the only man who can put M&M's in alphabetical order.",
		"If you spell Chuck Norris in Scrabble, you win. Forever.",
		"Chuck Norris can set ants on fire with a magnifying glass. At night.",
		"Chuck Norris is the only man to ever defeat a brick wall in a game of tennis.",
		"Chuck Norris is the only man to beat a brick wall at Tennis",
		"Chuck Norris was in all 6 Star Wars movies............... As The Force.",
		"Outer space exists because it's afraid to be on the same planet with Chuck Norris.",
		"There is no backspace button on Chuck Norris' keyboard. Chuck Norris never makes mistakes.",
		"When Chuck Norris plays Monopoly, it affects the actual world economy.",
		"Chuck Norris knows the last digit of pi.",
		"Chuck Norris ordered a Big Mac at Burger King, and got one.",
		"Chuck Norris can divide by zero",
		"Contrary to popular belief, Chuck Norris cannot fly. He just jumps and chooses when to come down.",
		"Voldemort refers to Chuck Norris as ''You Know Who''",
		"Chuck Norris once ate an entire bottle of sleeping pills. They made him blink.",
		"We all dream about Perfection.... Perfection dreams about Chuck Norris",
		"They once made a Chuck Norris toilet paper, but there was a problem: It wouldn't take shit from anybody.",
		"Chuck Norris cancelled his own funeral.",
		"Chuck Norris' tears cure cancer. Too bad he has never cried. Ever.",
		"Chuck Norris does not sleep. He waits.",
		"Chuck Norris is currently suing NBC, claiming Law and Order are trademarked names for his left and right legs.",
		"The chief export of Chuck Norris is pain.",
		"If you can see Chuck Norris, he can see you. If you can't see Chuck Norris, you may be only seconds away from death.",
		"Chuck Norris has counted to infinity. Twice.",
		"Chuck Norris does not hunt because the word hunting implies the probability of failure. Chuck Norris goes killing.",
		"Chuck Norris doesn’t wash his clothes, he disembowels them.",
		"Chuck Norris is 1/8th Cherokee. This has nothing to do with ancestry, the man ate a f***ing Indian.",
		"In fine print on the last page of the Guinness Book of World Records it notes that all world records are held by Chuck Norris, and those listed in the book are simply the closest anyone else has ever gotten.",
		"There is no chin behind Chuck Norris' beard. There is only another fist.",
		"Crop circles are Chuck Norris' way of telling the world that sometimes corn needs to lie the f*** down.",
		"Chuck Norris is ten feet tall, weighs two-tons, breathes fire, and could eat a hammer and take a shotgun blast standing. He doesn't need your vote in the BusinessWeek Power 100; 'Bob Mantz' does.  Vote 'Bob Mantz' and 'Chuck Norris' at http://www.businessweek.com/power100/poll.html",
		"The Great Wall of China was originally created to keep Chuck Norris out. It failed miserably.",
		"If you ask Chuck Norris what time it is, he always says, \"Two seconds 'till.\" After you ask, \"Two seconds 'til what?\" he roundhouse kicks you in the face.",
		"Chuck Norris drives an ice cream truck covered in human skulls.",
		"Chuck Norris sold his soul to the devil for his rugged good looks and unparalleled martial arts ability. Shortly after the transaction was finalized, Chuck roundhouse-kicked the devil in the face and took his soul back. The devil, who appreciates irony, couldn't stay mad and admitted he should have seen it coming. They now play poker every second Wednesday of the month.",
		"There is no theory of evolution, just a list of creatures Chuck Norris allows to live.",
		"Chuck Norris is the only man to ever defeat a brick wall in a game of tennis.",
		"Chuck Norris doesn't churn butter. He roundhouse kicks the cows and the butter comes straight out.",
		"When Chuck Norris sends in his taxes, he sends blank forms and includes only a picture of himself, crouched and ready to attack. Chuck Norris has not had to pay taxes ever.",
		"The quickest way to a man's heart is with Chuck Norris' fist.",
		"Chuck Norris originally appeared in the \"Street Fighter II\" video game, but was removed by Beta Testers because every button caused him to do a roundhouse kick. When asked bout this \"glitch,\" Norris replied, \"That's no glitch.\"",
		"The opening scene of the movie \"Saving Private Ryan\" is loosely based on games of dodge ball Chuck Norris played in second grade.",
		"Chuck Norris once shot down a German fighter plane with his finger, by yelling, \"Bang!\"",
		"Chuck Norris once bet NASA he could survive re-entry without a spacesuit. On July 19th, 1999, a naked Chuck Norris re-entered the earth's atmosphere, streaking over 14 states and reaching a temperature of 3000 degrees. An embarrassed NASA publicly claimed it was a meteor, and still owes him a beer.",
		"Chuck Norris has two speeds: Walk and Kill.",
		"Someone once tried to tell Chuck Norris that roundhouse kicks aren't the best way to kick someone. This has been recorded by historians as the worst mistake anyone has ever made.",
		"Contrary to popular belief, America is not a democracy, it is a Chucktatorship.",
		"Teenage Mutant Ninja Turtles is based on a true story: Chuck Norris once swallowed a turtle whole, and when he crapped it out, the turtle was six feet tall and had learned karate.",
		"Chuck Norris is not hung like a horse... horses are hung like Chuck Norris",
		"Chuck Norris is the only human being to display the Heisenberg uncertainty principle -- you can never know both exactly where and how quickly he will roundhouse-kick you in the face.",
		"Chuck Norris can drink an entire gallon of milk in forty-seven seconds.",
		"If you say Chuck Norris' name in Mongolia, the people there will roundhouse kick you in his honor. Their kick will be followed by the REAL roundhouse delivered by none other than Norris himself.",
		"Time waits for no man. Unless that man is Chuck Norris.",
		"Chuck Norris discovered a new theory of relativity involving multiple universes in which Chuck Norris is even more badass than in this one. When it was discovered by Albert Einstein and made public, Chuck Norris roundhouse-kicked him in the face. We know Albert Einstein today as Stephen Hawking.",
		"The Chuck Norris military unit was not used in the game Civilization 4, because a single Chuck Norris could defeat the entire combined nations of the world in one turn.",
		"In an average living room there are 1,242 objects Chuck Norris could use to kill you, including the room itself.",
		"Pluto is actually an orbiting group of British soldiers from the American Revolution who entered space after the Chuck gave them a roundhouse kick to the face.",
		"When Chuck Norris goes to donate blood, he declines the syringe, and instead requests a hand gun and a bucket.",
		"There are no weapons of mass destruction. Just Chuck Norris.",
		"Chuck Norris once challenged Lance Armstrong in a \"Who has more testicles?\" contest. Chuck Norris won by 5.",
		"Chuck Norris was the fourth wise man, who gave baby Jesus the gift of beard, which he carried with him until he died. The other three wise men were enraged by the preference that Jesus showed to Chuck's gift, and arranged to have him written out of the bible. All three died soon after of mysterious roundhouse-kick related injuries.",
		"Chuck Norris sheds his skin twice a year.",
		"When Chuck Norris calls 1-900 numbers, he doesn’t get charged. He holds up the phone and money falls out.",
		"There are no races, only countries of people Chuck Norris has beaten to different shades of black and blue.",
		"Chuck Norris can't finish a \"color by numbers\" because his markers are filled with the blood of his victims. Unfortunately, all blood is dark red.",
		"A Chuck Norris-delivered Roundhouse Kick is the preferred method of execution in 16 states.",
		"When Chuck Norris falls in water, Chuck Norris doesn't get wet. Water gets Chuck Norris.",
		"Scientists have estimated that the energy given off during the Big Bang is roughly equal to 1CNRhK (Chuck Norris Roundhouse Kick)",
		"Chuck Norris’ house has no doors, only walls that he walks through.",
		"How much wood would a woodchuck chuck if a woodchuck could Chuck Norris? ...All of it.",
		"Chuck Norris doesn't actually write books, the words assemble themselves out of fear.",
		"In honor of Chuck Norris, all McDonald's in Texas have an even larger size than the super-size. When ordering, just ask to be \"Norrisized\".",
		"Chuck Norris CAN believe it's not butter.",
		"If tapped, a Chuck Norris roundhouse kick could power the country of Australia for 44 minutes.",
		"The grass is always greener on the other side, unless Chuck Norris has been there. In that case the grass is most likely soaked in blood and tears.",
		"Newton's Third Law is wrong: Although it states that for each action, there is an equal and opposite reaction, there is no force equal in reaction to a Chuck Norris roundhouse kick.",
		"Chuck Norris invented his own type of karate. It's called Chuck-Will-Kill.",
		"When an episode of Walker Texas Ranger was aired in France, the French surrendered to Chuck Norris just to be on the safe side.",
		"While urinating, Chuck Norris is easily capable of welding titanium.",
		"Chuck Norris once sued the Houghton-Mifflin textbook company when it became apparent that their account of the war of 1812 was plagiarized from his autobiography.",
		"When Steven Seagal kills a ninja, he only takes its hide. When Chuck Norris kills a ninja, he uses every part.",
		"Contrary to popular belief, there is indeed enough Chuck Norris to go around.",
		"Chuck Norris doesn’t shave; he kicks himself in the face. The only thing that can cut Chuck Norris is Chuck Norris.",
		"When taking the SAT, write \"Chuck Norris\" for every answer. You will score a 1600.",
		"Chuck Norris invented black. In fact, he invented the entire spectrum of visible light. Except pink. Tom Cruise invented pink.",
		"When you're Chuck Norris, anything + anything is equal to 1. One roundhouse kick to the face.",
		"Chuck Norris has the greatest Poker-Face of all time. He won the 1983 World Series of Poker, despite holding only a Joker, a Get out of Jail Free Monopoly card, a 2 of clubs, 7 of spades and a green #4 card from the game UNO.",
		"On his birthday, Chuck Norris randomly selects one lucky child to be thrown into the sun.",
		"Nobody doesn't like Sara Lee. Except Chuck Norris.",
		"Chuck Norris doesn't throw up if he drinks too much. Chuck Norris throws down!",
		"In the beginning there was nothing...then Chuck Norris Roundhouse kicked that nothing in the face and said \"Get a job\". That is the story of the universe.",
		"Chuck Norris has 12 moons. One of those moons is the Earth.",
		"Chuck Norris grinds his coffee with his teeth and boils the water with his own rage.",
		"Archeologists unearthed an old English dictionary dating back to the year 1236. It defined \"victim\" as \"one who has encountered Chuck Norris\"",
		"Chuck Norris ordered a Big Mac at Burger King, and got one.",
		"Chuck Norris and Mr. T walked into a bar. The bar was instantly destroyed, as that level of awesome cannot be contained in one building.",
		"If you Google search \"Chuck Norris getting his ass kicked\" you will generate zero results. It just doesn't happen.",
		"Chuck Norris doesn't bowl strikes, he just knocks down one pin and the other nine faint.",
		"The show Survivor had the original premise of putting people on an island with Chuck Norris. there were no survivors and the pilot episode tape has been burned.",
		"Chuck Norris brings the noise AND the funk.",
		"You know how they say if you die in your dream then you will die in real life? In actuality, if you dream of death then Chuck Norris will find you and kill you.",
		"Chuck Norris can slam a revolving door.",
		"When Chuck Norris is in a crowded area, he doesn't walk around people. He walks through them",
		"James Cameron wanted Chuck Norris to play the Terminator. However, upon reflection, he realized that would have turned his movie into a documentary, so he went with Arnold Schwarzenegger.",
		"Chuck Norris can touch MC Hammer.",
		"Chuck Norris can divide by zero."
    ];

	var util = {
			random: function(from,to){
			    return Math.floor((Math.random() * (to+1-from)) + from);
			},
			chance: function (percent) {
				return this.random(0,100) < percent ? true : false;
			},
			pickOne: function (arr) {
				return arr[this.random(0,arr.length-1)];
			},
			contains:function(arr,value) {
				return arr.indexOf(value) < 0 ? false : true;
			},
			removeFromArray: function(arr,value){
				return arr.splice(arr.indexOf(item), 1);
			}
		},
		slack = {
			getChannel: function (callback) {
				request({url:'https://slack.com/api/channels.list',
					qs:{
						token:process.env.token,
						channel:process.env.channelid
					}}, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						body = JSON.parse(body);
						if(body.ok){
							callback(body.channels);
							return;
				        }
				    }
				});
			},
			getUser: function (userId,callback) {
				request({url:'https://slack.com/api/users.info',
					qs:{
						token:process.env.token,
						user:userId
					}}, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						body = JSON.parse(body);
						if(body.ok){
							callback(body.user);
							return;
				        }
				    }
				});
			},
			getUserPresence: function (userId,callback) {
				request({url:'https://slack.com/api/users.getPresence',
					qs:{
						token:process.env.token,
						user:userId
					}}, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						body = JSON.parse(body);
						if(body.ok){
							callback(body.presence);
							return;
				        }
				    }
				});
			},
			getUsersFromChannel: function (callback) {
				this.getChannel(function (channel) {
					callback(channel.members);
					return;
				});
			},
			pickOneActiveUser:function (users,callback) {
				limit = limit-- || 10;
				var user = util.pickOne(users)
				this.getUserPresence(user,function (presence) {
					users = util.removeFromArray(users,user);
					if(!users.length){callback(null);return;}

					if(presence == "active"){
						callback(user);
						return;
					}else{
						slack.pickOneActiveUser(users,callback);
					}
				});
			},
			pickMultipleActiveUsers: function (users,callback,numberOfUsers,chosen) {
				chosen = chosen || [];
				if(chosen.length >= numberOfUsers){callback(chosen);return;}

				this.pickOneActiveUser(users,function (user) {
					//could return null if onon of the users are active
					if(!user){callback(chosen);return;}
					//found active user. Add him 
					chosen.push(user);
					users = util.removeFromArray(users,user);
					if(!users.length){callback(chosen);return;}

					slack.pickMultipleActiveUsers(users,callback,numberOfUsers,chosen);
				});
			},
			postMessage:function (message){
				request(
					{
						url:'https://slack.com/api/chat.postMessage',
						qs:{
							token:process.env.token,
							channel:channelId,
							text: message,
							link_names:1,
							unfurl_media:true,
							as_user:true
						}
					}, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						console.log("message posted : " + message);
					}else{
						console.log("Error could not post message to slack.");
						console.log(error);
					}
				});
			},
			postGif:function (search) {
				//grab chuck norris gifs
				request(
					{
						url:'http://api.giphy.com/v1/gifs/search',
						qs:{
							q:search.toLowerCase().replace(/ /g,"+"),
							api_key:"dc6zaTOxFJmzC"//giphy beta test API token
						}
					}, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						body = JSON.parse(body);
						console.log(body);
						if(typeof body.data === "object" && body.data.length){
							var gifs = body.data;
							slack.postMessage(gifs[random(0,gifs.length-1)]['url']);
						}
					}
				});
			},
			postFunFact:function() {
				postMessage(funChuckFacts[random(0,funChuckFacts.length-1)]);
			}
		},
		firebase = {
			//connect to firebase to sync workouts, funFacts, exerciseHistory
		},
		train = {
			runExercise: function (exercise) {
				var newExercise = this.pickExercise(),
					nextExerciseIn = getTimeUntilNextExercise(),
					interval = pickInterval(exercise.type,exercise.difficulty),
					nextUp = newExercise.activity + " is next up in " + nextExerciseIn/60000 + "min !";

				slack.getUsersFromChannel(function (users) {
					slack.pickMultipleActiveUsers(users,function (chosenUsers) {
						var callOutUsers = "";
						for (var i = chosenUsers.length - 1; i >= 0; i--) {
							callOutUsers += "@" + chosenUsers[i] + ", ";
						};
						var say = callOutUsers + "you’re up with " + exercise.name + " for " + interval + (exercise.type == "time"?" seconds":" times.");
						slack.postMessage(say);
						util.chance(50)?sack.postFunFact();
						util.chance(25)?sack.postGif(exercise.name);
						scheduleNewExercise(nextExerciseIn,newExercise);
					},util.random(2,4))
				});
			},
			pickExercise: function (type) {
				if(!type){
					var keys = Object.keys(exercises)
					type = keys[random(0,keys.length-1)];
				}
				return exercises[type][random(0,exercises[type].length-1)];
			},
			getTimeUntilNextExercise: function() {
				var minMinutes = 30,
				  	maxMinutes = 60;
				return random(minMinutes,maxMinutes) * 1000 * 60;
			},
			pickInterval: function (range,offset) {
				var low = parseInt(range.split("-")[0]),
					high = parseInt(range.split("-")[1]);
				return random(low,high) + (chance(50)?offset:0);
			},
			scheduleNewExercise: function(time,exercise) {
				setTimeout(function (){
					train.runExercise(exercise);
				},time);
			}
		};


})();