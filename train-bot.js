/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
          \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
           \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

  Run your bot from the command line:

    token=<MY TOKEN> node bot.js

# USE THE BOT:

  Find your bot inside Slack to send it a direct message.

  Say: "Hello"

  The bot will reply "Hello!"

  Say: "who are you?"

  The bot will tell you its name, where it running, and for how long.

  Say: "Call me <nickname>"

  Tell the bot your nickname. Now you are friends.

  Say: "who am I?"

  The bot will tell you your nickname, if it knows one for you.

  Say: "shutdown"

  The bot will ask if you are sure, and then shut itself down.

  Make sure to invite your bot into other channels using /invite @<my bot>!

# EXTEND THE BOT:

  Botkit is has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//trainer-bot token = xoxb-18990592451-YyM84c6iXL4CZTNLGnldKt7K

if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js'),
    os = require('os'),
    http = require('http'),
    request = require('request'),
    channelId = "C0K2A2R7U",//train-me-sempai
    users = {},
    channels = {},
    exercises = [
    {
      activity:"Pushups",
      type:"count",
      say:"Do XXX pushups!",
      verb:"are",
      difficulty:8
    },{
      activity:"Plank",
      type:"timed",
      say:"Hold Plank for XXXs!",
      verb:"is",
      difficulty:2
    },{
      activity:"Pullups",
      type:"count",
      say:"Do XXX pullups!",
      verb:"are",
      difficulty:20
    },{
      activity:"Coffee Time!",
      type:"once",
      say:"Go get yourself a coffee in the kitchen!",
      verb:"is",
      difficulty:100
    },{
      activity:"Jumping Jacks",
      type:"count",
      say:"Do XXX jumping jacks now! High Five the first person to laugh at you.",
      verb:"are",
      difficulty:5
    },{
      activity:"Running",
      type:"count",
      say:"log .XXX miles on the treadmil!",
      verb:"is",
      difficulty:49
    },{
      activity:"Stairs",
      type:"once",
      say:"take the stairs to the 6th floor and back XXX time!",
      verb:"are",
      difficulty:100
    },{
      activity:"Nap",
      type:"once",
      say:"take a 5min nap.",
      verb:"a are",
      difficulty:100
    },{
      activity:"Situps",
      type:"count",
      say:"I know you were waiting for it. XXX situps please!",
      verb:"are",
      difficulty:5
    },{
      activity:"burpees",
      type:"count",
      say:" XXX burpees!",
      verb:"are",
      difficulty:5
    },{
      activity:"Wall sits",
      type:"timed",
      say:"wall sits for XXXs if you please.",
      verb:"are",
      difficulty:2
    }],
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
      "Chuck Norris once kicked a horse in the chin. Its decendants are known today as Giraffes.",
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
      "Chuck Norris was dropped twice as a baby. First on Hiroshima, then on Nagasaki.",
      "Chuck Norris played Russian Roulette with a fully loaded gun and won.",
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
      "Chuck Norris once roundhouse kicked someone so hard that his foot broke the speed of light, went back in time, and killed Amelia Earhart while she was flying over thePacific Ocean.",
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
      "A Handicap parking sign does not signify that this spot is for handicapped people. It is actually in fact a warning, that the spot belongs to Chuck Norris and that you will be handicapped if you park there.",
      "Chuck Norris will attain statehood in 2009. His state flower will be the Magnolia.",
      "Nagasaki never had a bomb dropped on it. Chuck Norris jumped out of a plane and punched the ground.",
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
      "Chuck Norris once ate a whole cake before his friends could tell him there was a stripper in it.",
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
      "Wilt Chamberlain claims to have slept with more than 20,000 women in his lifetime. Chuck Norris calls this \"a slow Tuesday.\"",
      "Contrary to popular belief, there is indeed enough Chuck Norris to go around.",
      "Chuck Norris doesn’t shave; he kicks himself in the face. The only thing that can cut Chuck Norris is Chuck Norris.",
      "For some, the left testicle is larger than the right one. For Chuck Norris, each testicle is larger than the other one.",
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
      "Chuck Norris can divide by zero.",
    ];

var controller = Botkit.slackbot({
    debug: false,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

// setTimeout(function () {
// request({url:'https://slack.com/api/chat.postMessage',
//             qs:{
//               token:process.env.token,
//               channel:"C07J02HD0",//water-cooler
//               text: "@channel @all Get ready to be trained by me! I will give you random exercises to complete throughout the day. Join the #train-me-sempai channel to participate. we will start in 30min!",
//               link_names:1,
//               unfurl_media:true,
//               as_user:true
//             }}, function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//          console.log("message posted : 30min intro");
//       }
//   });
// },1000 * 60 * 15);
// setTimeout(function () {
// request({url:'https://slack.com/api/chat.postMessage',
//             qs:{
//               token:process.env.token,
//               channel:"C07J02HD0",//water-cooler
//               text: "@channel @all Get ready to be trained by me! I will give you random exercises to complete throughout the day. Join the #train-me-sempai channel to participate. we will start in 10min!",
//               link_names:1,
//               unfurl_media:true,
//               as_user:true
//             }}, function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//          console.log("message posted : 30min intro");
//       }
//   });
// },1000 * 60 * 35);
// setTimeout(function () {
//   request({url:'https://slack.com/api/chat.postMessage',
//             qs:{
//               token:process.env.token,
//               channel:"C07J02HD0",//water-cooler
//               text: funChuckFacts[random(0,funChuckFacts.length-1)] + "Join the #train-me-sempai channel to get trained by me!",
//               link_names:1,
//               unfurl_media:true,
//               as_user:true
//             }}, function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//          console.log("message posted : 30min intro");
//       }
//   });
// },1000 * 60 * 25);
// setTimeout(function () {
//   postGif("chuck+norris");
// },1000 * 60 *10);

//postMessage("@channel ok last random pick of the day in 2 min! Please leave feedback what you thought about your first day training!");

//grab all users
request({url:'https://slack.com/api/users.list',
          qs:{
            token:process.env.token,
            presence:1
          }}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        body = JSON.parse(body);
        if(body.ok){
          users = body.members;
          loadChannels(function () {
            //setTimeout(function(){runExercise(pickExercise())},1000 * 60 * 20);
            setTimeout(function(){runExercise(exercises[6])},1000 * 60 * 2);
          });
        }
    }
});
function loadChannels (callback) {
  //grab existing channels
  request({url:'https://slack.com/api/channels.list',
            qs:{
              token:process.env.token
            }}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
          if(body.ok){
            channels = body.channels;
            callback();
          }
      }
  });
}
function random(from,to){
    return Math.floor((Math.random() * (to+1-from)) + from);
}
function pickRandomActiveUser() {
  var limit = 100,
      user,
      tempUser,
      tempUserId,
      channel = getChannel(channelId);
  while(user == null || limit > 0){
    limit--;
    console.log("Channel Members" + channel.members);
    tempUserId = channel.members[random(0,channel.members.length-1)];
    console.log("choosen ID" + tempUserId);
    tempUser = getUser(tempUserId);
    console.log("choosen User" + tempUser);
    if(tempUser.presence == 'active' && !tempUser.is_bot){
      user = tempUser;
    }
  }
  return user;
}
function getChannel(channelId) {
  for (var i = channels.length - 1; i >= 0; i--) {
    if(channels[i].id == channelId){
      return channels[i];
    }
  };
}
function getUser(userId) {
  for (var i = users.length - 1; i >= 0; i--) {
    if(users[i].id == userId){
      return users[i];
    }
  };
}
function pickExercise () {
  return exercises[random(0,exercises.length-1)];
}
function pickInterval(type,difficulty) {
  var countLow = 10,
      countHigh = 100,
      timedLow = 10,
      timedHigh = 100;
  switch(type){
    case "count":
      return Math.ceil(random(countLow,countHigh) / difficulty);
      break;
    case "timed":
      return Math.ceil(random(timedLow,timedHigh) / difficulty);
      break;
    case "once":
      return 1;
      break;
    default:
      return Math.ceil(random(10,100) / difficulty);
  }
}

function getTimeUntilNextExercise () {
  var minMinutes = 30,
      maxMinutes = 60;
  return random(minMinutes,maxMinutes) * 1000 * 60;
}

function scheduleNewExercise(time,exercise) {
  setTimeout(function (){
    runExercise(exercise)
  },time);
}

function runExercise(exercise) {
  var newExercise = pickExercise(),
      nextExerciseIn = getTimeUntilNextExercise(),
      interval = pickInterval(exercise.type,exercise.difficulty),
      user = pickRandomActiveUser(),
      activityText = "@" + user.name + (random(0,100) > 95 ? " You get to pick some to have them: ":((random(0,100) > 50 ? " and @" + pickRandomActiveUser().name + " ":" "))) +  exercise.say.replace("XXX",interval),
      nextUp = "next up " + newExercise.verb + " " + newExercise.activity + " get " + getEnglish() + "!";

  postFunFact();
  if(random(0,100) > 80){
    postGif((random(0,100) > 50 ? "chuck+norris":exercise.activity));
  }
  setTimeout(function(){
    postMessage(activityText);
  },5000);
  // setTimeout(function(){
  //   postMessage(nextUp);
  // },20000);
  
  scheduleNewExercise(nextExerciseIn,newExercise);
}
function postFunFact () {
  postMessage(funChuckFacts[random(0,funChuckFacts.length-1)]);
}
function postGif(type) {
  //grab chuck norris gifs
  request({url:'http://api.giphy.com/v1/gifs/search',
            qs:{
              q:type.toLowerCase().replace(/ /g,"+"),
              api_key:"dc6zaTOxFJmzC"
            }}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          body = JSON.parse(body);
          console.log(body);
          if(typeof body.data === "object" && body.data.length){
            var gifs = body.data;
            postMessage(gifs[random(0,gifs.length-1)]['url']);
          }
      }
  });
}
function getEnglish () {
  var options = ["pumped","excited","ready"];
  return options[random(0,options.length-1)];
}
function postMessage(message){
  request({url:'https://slack.com/api/chat.postMessage',
            qs:{
              token:process.env.token,
              channel:channelId,
              text: message,
              link_names:1,
              unfurl_media:true,
              as_user:true
            }}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
         console.log("message posted : " + message);
      }
  });
}
function updatePresence(userId,presence) {
  for (var i = users.length - 1; i >= 0; i--) {
    if(users[i].id == userId){
      users[i].presence = presence;
      return;
    }
  };
}

controller.on('presence_change',function(bot,message) {
    updatePresence(message.user,message.presence);
});  
controller.on('team_join',function(bot,message) {
    loadChannels(function(){});
});
// controller.hears(['hello','hi'],'direct_message,direct_mention,mention',function(bot, message) {

//     bot.api.reactions.add({
//         timestamp: message.ts,
//         channel: message.channel,
//         name: 'robot_face',
//     },function(err, res) {
//         if (err) {
//             bot.botkit.log('Failed to add emoji reaction :(',err);
//         }
//     });


//     controller.storage.users.get(message.user,function(err, user) {
//         if (user && user.name) {
//             bot.reply(message,'Hello ' + user.name + '!!');
//         } else {
//             bot.reply(message,'Hello.');
//         }
//     });
// });

// controller.hears(['call me (.*)'],'direct_message,direct_mention,mention',function(bot, message) {
//     var matches = message.text.match(/call me (.*)/i);
//     var name = matches[1];
//     controller.storage.users.get(message.user,function(err, user) {
//         if (!user) {
//             user = {
//                 id: message.user,
//             };
//         }
//         user.name = name;
//         controller.storage.users.save(user,function(err, id) {
//             bot.reply(message,'Got it. I will call you ' + user.name + ' from now on.');
//         });
//     });
// });

controller.hears(['chuck','norris','chuck norris'],'direct_mention,mention,ambient',function(bot, message) { 
  postGif('chuck+norris');
  postMessage(funChuckFacts[random(0,funChuckFacts.length-1)]);
});


// controller.hears(['shutdown'],'direct_message,direct_mention,mention',function(bot, message) {

//     bot.startConversation(message,function(err, convo) {
//         convo.ask('Are you sure you want me to shutdown?',[
//             {
//                 pattern: bot.utterances.yes,
//                 callback: function(response, convo) {
//                     convo.say('Bye!');
//                     convo.next();
//                     setTimeout(function() {
//                         process.exit();
//                     },3000);
//                 }
//             },
//         {
//             pattern: bot.utterances.no,
//             default: true,
//             callback: function(response, convo) {
//                 convo.say('*Phew!*');
//                 convo.next();
//             }
//         }
//         ]);
//     });
// });


// controller.hears(['uptime','identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {

//     var hostname = os.hostname();
//     var uptime = formatUptime(process.uptime());

//     bot.reply(message,':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');

// });

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
