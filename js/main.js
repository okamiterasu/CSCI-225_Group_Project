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

async function load_highscores()
{
	async function load_highscore(game)
	{
		const leaderboard = $("#"+game+" .leaderboard");
		const game_collection = collection(db, game);
		const game_snapshot = await getDocs(game_collection);
		const game_scores = game_snapshot.docs.map( doc => doc.data());
		// Sort by scores descending. This could probably be part of the query somehow.
		game_scores.sort((a, b) => {a.score - b.score});
		const tbody = $("<tbody>");
			for (let i=0; i < 5; i++)
			{
				if (i >= game_scores.length)
				{
					break;
				}
				const score = game_scores[i];
				const tr = $("<tr>");
				tr.append("<td>"+score["name"]+"</td>");
				tr.append("<td>"+score["score"]+"</td>");
				tbody.append(tr);
			}
		const img = leaderboard.find("img");
		img.remove();
		const table = leaderboard.find("table");
		table.append(tbody)
		table.css("visibility", "unset");
	}
	for (const game of ["game1", "game2"])
	{
		await load_highscore(game);
	}
}

$(load_highscores)