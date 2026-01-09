const SESSION_KEY = "zomboid_session";
const SCORE_KEY = "zomboid_score";

const challenges = [
    {
        "id": "insomniac",
        "name": "The Insomniac",
        "description": "Keep the entire group awake for 24 in‑game hours using any means neccessary.",
        "trigger": "trip_start",
        "category": "social",
        "difficulty": "medium",
        "points": 2
    },
    {
        "id": "hoarder",
        "name": "The Hoarder",
        "description": "You need to fill up the car with anything you come accross and defend any item as potentially useful if questioned.",
        "trigger": "trip_start",
        "category": "roleplay",
        "difficulty": "easy",
        "points": 1
    },
    {
        "id": "paranoid_one",
        "name": "The Detective",
        "description": "Ask probing questions about what people are doing but never accuse directly of doing 'X' challenge.",
        "trigger": "trip_start",
        "category": "roleplay",
        "difficulty": "easy",
        "points": 1
    },
    {
        "id": "overprepared_medic",
        "name": "The Overprepared Medic",
        "description": "You must hoard all medical supplies you find and only reveal them when absolutely necessary.",
        "trigger": "trip_start",
        "category": "roleplay",
        "difficulty": "easy",
        "points": 1
    },
    {
        "id": "secret_courier",
        "name": "The Secret Courier",
        "description": "Choose a random player and convince them to carry an item of your choosing to the end.",
        "trigger": "trip_start",
        "category": "stealth",
        "difficulty": "hard",
        "points": 3
    },
    {
        "id": "navigator",
        "name": "The Navigator",
        "description": "Convince the group to take at least two unnecessary detours justify it anyway you want.",
        "trigger": "on_road",
        "category": "manipulation",
        "difficulty": "medium",
        "points": 2
    },
    {
        "id": "ghost",
        "name": "The Ghost",
        "description": "When out of the car, avoid being alone with any one player for more than 30 seconds. Always find a reason to leave.",
        "trigger": "on_road",
        "category": "behavioural",
        "difficulty": "hard",
        "points": 3
    },
    {
        "id": "snack_bandit",
        "name": "The Snack Bandit",
        "description": "Secretly eat or hide all food items without being noticed. If caught say you were hungry.",
        "trigger": "on_road",
        "category": "sabotage",
        "difficulty": "medium",
        "points": 2
    },
    {
        "id": "zombie_magnet",
        "name": "The Zombie Magnet",
        "description": "Lead the group into at least two big zombie group encounters 'by accident' and act surprised each time.",
        "trigger": "on_road",
        "category": "sabotage",
        "difficulty": "hard",
        "points": 3
    },
    {
        "id": "loot_goblin",
        "name": "The Loot Goblin",
        "description": "Insist on searching every building thoroughly for 'loot'. Each place you stop you must find at least one thing and tell everyone about it.",
        "trigger": "on_road",
        "category": "roleplay",
        "difficulty": "easy",
        "points": 1
    },
    {
        "id": "distractor",
        "name": "The Distractor",
        "description": "Interrupt or derail at least three group discussions using jokes, questions, or sudden discoveries.",
        "trigger": "on_road",
        "category": "social",
        "difficulty": "medium",
        "points": 2
    },
    {
        "id": "mechanic",
        "name": "The Mechanic",
        "description": "Convince the group to change cars at least twice",
        "trigger": "on_road",
        "category": "manipulation",
        "difficulty": "medium",
        "points": 2
    },
    {
        "id": "historian",
        "name": "The Historian",
        "description": "Invent historical facts about every town or landmark you pass and deliver them confidently.",
        "trigger": "on_road",
        "category": "roleplay",
        "difficulty": "easy",
        "points": 1
    },
    {
        "id": "fuel_thrifter",
        "name": "The Fuel Thrifter",
        "description": "Convince the group to stop for fuel at least three times even when it's unnecessary.",
        "trigger": "stop_vehicle",
        "category": "manipulation",
        "difficulty": "hard",
        "points": 3
    },
    {
        "id": "cautious_scout",
        "name": "The Overly Cautious Scout",
        "description": "Insist on scouting ahead whenever the group stops and return with exaggerated danger reports.",
        "trigger": "stop_vehicle",
        "category": "roleplay",
        "difficulty": "medium",
        "points": 2
    },
    {
        "id": "eternal_optimist",
        "name": "The Eternal Optimist",
        "description": "Remain cheerful no matter what happens. Every disaster must be 'a blessing in disguise'.",
        "trigger": "nightfall",
        "category": "behavioural",
        "difficulty": "easy",
        "points": 1
    },
    {
        "id": "sleepy_boy",
        "name": "The Scaredy Cat",
        "description": "If the group stops for the night somewhere you must share a bed with someone.",
        "trigger": "nightfall",
        "category": "behavioural",
        "difficulty": "easy",
        "points": 1
    },
    {
        "id": "break_free",
        "name": "I Want To Break Free",
        "description": "You must find and equip womens lingerie (bra and undies) and wear only them when going to sleep each night.",
        "trigger": "nightfall",
        "category": "behavioural",
        "difficulty": "easy",
        "points": 1
    },
    {
        "id": "the_traitor",
        "name": "The Traitor",
        "description": "Prevent at least one player from reaching the end...",
        "trigger": "nightfall",
        "category": "sabotage",
        "difficulty": "hard",
        "points": 3
    }
];

let sessionChallenges = [];
let totalScore = 0;

const startScreen = document.getElementById('startScreen');
const challengesScreen = document.getElementById('challengesScreen');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const scoreValue = document.getElementById('scoreValue');

window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
        sessionChallenges = JSON.parse(saved);
        renderChallenges();
        startScreen.style.display = "none";
        challengesScreen.classList.add("show");
    }
});

startBtn.addEventListener("click", initializeChallenges);
resetBtn.addEventListener("click", resetChallenges);

function initializeChallenges() {
    const beforeTrip = getRandomChallenge("trip_start");
    const onRoad = getRandomChallenge("on_road");
    const special = getRandomChallenge(["stop_vehicle", "nightfall"]);

    sessionChallenges = [
        { ...beforeTrip, completed: false },
        { ...onRoad, completed: false },
        { ...special, completed: false }
    ];

    saveSession();
    renderChallenges();

    startScreen.style.display = "none";
    challengesScreen.classList.add("show");
}

function saveSession() {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionChallenges));
    localStorage.setItem(SCORE_KEY, totalScore.toString());
}

function getRandomChallenge(trigger) {
    const pool = Array.isArray(trigger)
        ? challenges.filter(c => trigger.includes(c.trigger))
        : challenges.filter(c => c.trigger === trigger);

    return pool[Math.floor(Math.random() * pool.length)];
}

function renderChallenges() {
    document.getElementById('beforeTripChallenge').innerHTML = createChallengeCard(sessionChallenges[0], 0);
    document.getElementById('onRoadChallenge').innerHTML = createChallengeCard(sessionChallenges[1], 1);
    document.getElementById('specialChallenge').innerHTML = createChallengeCard(sessionChallenges[2], 2);

    updateScore();
}

function createChallengeCard(challenge, index) {
    return `
        <div class="challenge-card ${challenge.completed ? 'completed' : ''}" id="card-${index}">
            <div class="card-header">
                <div class="checkbox-wrapper">
                    <input type="checkbox"
                            class="checkbox"
                            id="checkbox-${index}"
                            ${challenge.completed ? 'checked' : ''}
                            onchange="toggleChallenge(${index})">
                </div>
                <div class="card-content">
                    <div class="challenge-name">${challenge.name}</div>
                    <div class="challenge-description">${challenge.description}</div>
                    <div class="challenge-meta">
                        <span class="badge difficulty-${challenge.difficulty}">${challenge.difficulty}</span>
                        <span class="badge points">${challenge.points} ${challenge.points === 1 ? 'point' : 'points'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function toggleChallenge(index) {
    const challenge = sessionChallenges[index];
    challenge.completed = !challenge.completed;

    const card = document.getElementById(`card-${index}`);
    card.classList.toggle("completed", challenge.completed);

    updateScore();
    saveSession();
}

function updateScore() {
    totalScore = sessionChallenges
        .filter(c => c.completed)
        .reduce((sum, c) => sum + c.points, 0);

    scoreValue.textContent = `${totalScore} ${totalScore === 1 ? "point" : "points"}`;
}

function resetChallenges() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SCORE_KEY);
    window.location.reload();
}