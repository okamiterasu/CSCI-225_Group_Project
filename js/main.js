// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDPQ3lQbwy1w8DvyoCB5_6UjH4gGI275UA",
	authDomain: "csci-225-project.firebaseapp.com",
	projectId: "csci-225-project",
	storageBucket: "csci-225-project.appspot.com",
	messagingSenderId: "43983307696",
	appId: "1:43983307696:web:bc60e4b0c1c2b90d3f8c75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Setup rule popups
const overlay = $("#rule-overlay");
const rule_box = $("#rule-box");
function display_rules(url)
{
	rule_box.load(url);
	if (url.slice(-3) === "txt")
	{
		rule_box.addClass("rawtext");
	}
	else
	{
		rule_box.removeClass("rawtext");
	}
	overlay.removeClass("hidden");
}
overlay.children("button").click(()=>{overlay.addClass("hidden")})
$("#bj-rules").click(()=>{display_rules("./blackjack/rules.html")})
$("#rpg-rules").click(()=>{display_rules("./rpg/readme/daRules.txt")})


// Create highscore tables
const GAMES = ["blackjack", "rpgScore"];
const MAX_HIGHSCORES = 5;

function load_highscores()
{
	async function load_highscore(game)
	{
		const game_collection = collection(db, game);
		const game_snapshot = await getDocs(game_collection);
		const game_scores = game_snapshot.docs.map(doc => doc.data());
		return [game, game_scores]
	}

	function write_scoreboard(game, highscores)
	{
		const leaderboard = $("#"+game+" .leaderboard");
		highscores.sort((a, b) => {a.score - b.score});
		const tbody = $("<tbody>");
		leaderboard.find("table").append(tbody);
		for (let i=0; i < MAX_HIGHSCORES; i++)
		{
			if (i >= highscores.length)
			{
				// Exit early if there aren't enough scores to fill the table
				break;
			}
			const score = highscores[i];
			const tr = $("<tr>");
			tr.append("<td>"+score["name"]+"</td>");
			tr.append("<td>"+score["score"]+"</td>");
			tbody.append(tr);
		}
		leaderboard.removeClass("loading")
	}

	Promise
	.all(GAMES.map(load_highscore))
	.then((everything)=>{
		everything.forEach(([game, scores])=>{
			write_scoreboard(game, scores);
		})
	});

}

$(load_highscores)