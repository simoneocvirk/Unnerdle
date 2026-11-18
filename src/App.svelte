<script>
	import { wordle_answers } from './words.js';
	import { getBlankLetterFrequency } from './utils/getBlankLetterFrequency.js';
	import { isSolutionValidForEntry } from './utils/isSolutionValidForEntry.js';
	import { sortObject } from './utils/sortObject.js';

	let WORDLENGTH = 5;
	let showInstructions = false;
	let darkMode = false;

	let relevanceScores = {};
	let filteredAnswers = wordle_answers;
	let letterFrequency = getBlankLetterFrequency();
	let entries=[[]];

	function runAnalysis() {
		filteredAnswers = wordle_answers;

		filteredAnswers = filteredAnswers.filter(word => {
			let keepWord = true;

			for (let entryIndex = 0; entryIndex < entries.length - 1; entryIndex++) {
				const entry = entries[entryIndex];

				if (!isSolutionValidForEntry(entry, word)) {
					keepWord = false;
					break;
				}
			}

			return keepWord;
		});

		letterFrequency = getBlankLetterFrequency();
		filteredAnswers.forEach(word => {
			for (let pos=0; pos<word.length; pos++) {
				letterFrequency[pos][word[pos]]++;
			}
		});

		relevanceScores = {};
		filteredAnswers.forEach(word => {
			relevanceScores[word] = 0;
			for (let pos=0; pos<word.length; pos++) {
				relevanceScores[word] += letterFrequency[pos][word[pos]];
			}
		});
		relevanceScores = sortObject(relevanceScores);
	}

	function keyPress(key, keyCode){
		if (keyCode == 8) {
			entries[entries.length-1] = entries[entries.length-1].slice(0, -1);
		} else if (keyCode >= 65 && keyCode <= 90 && entries[entries.length-1].length < WORDLENGTH) {
			entries[entries.length-1] = [...entries[entries.length-1], {letter: key, state: -1}];
		} else if (keyCode === 13 && entries[entries.length-1].length === WORDLENGTH) {
			for (let pos=0; pos<entries[entries.length-1].length; pos++) {
				entries[entries.length-1][pos].state = 0;
			}
			entries = [...entries, []];
			runAnalysis();
		}
	}

	function handleKeydown(event) {
		let key = event.key;
		let keyCode = event.keyCode;
		keyPress(key, keyCode);
	}

	function keyboardEntry(key) {
		if (key === "Backspace") {
			keyPress(key, 8);
		} else if (key === "Enter") {
			keyPress(key, 13);
		} else {
			keyPress(key, key.charCodeAt(0)-32);
		}
	}

	function tilePress(e_index, l_index) {
		if (e_index < entries.length-1) {
			entries[e_index][l_index].state = (entries[e_index][l_index].state + 1) % 3;
			runAnalysis();
		}
	}
	
	function getTileStateName(state) {
		if (state === 0) {
			return "absent";
		} else if (state === 1) {
			return "present";
		} else if (state === 2) {
			return "correct";
		} else if (state === -1) {
			return "tbd";
		}
		return "empty";
	}

</script>

<svelte:window on:keydown={handleKeydown} on:load="{runAnalysis}"/>
<div id="game">
	<header>
		<div>
			<img class="logo" src="nerdle_logo.png">
        	<span class="unnerdle">unnerdle.</span>
		</div>
	</header>
	<div id="board-container">
		<div id="board" style="width: 350px; height: 420px;">
			{#each entries as entry, e_index}
				<game-row length={WORDLENGTH}>
					<div class="row">
						{#each entry as tile, l_index}
							<game-tile on:click={() => tilePress(e_index, l_index)}>
								<div class="tile" data-state="{getTileStateName(tile.state)}" data-animation="pop">{tile.letter}</div>
							</game-tile>
						{/each}
						{#each {length: WORDLENGTH - entry.length} as _}
							<game-tile>
								<div class="tile" data-state="empty"></div>
							</game-tile>
						{/each}
					</div>
				</game-row>
			{/each}
			<div class="suggestions">
				<div class="suggestion {darkMode ? 'darkModeText': ''}" id="title">Best words to guess next</div>
				{#each Object.entries(relevanceScores) as [word, score], index}
					{#if index < 10}
						<div class="suggestion {darkMode ? 'darkModeText': ''}">{index+1}. {word}</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
	<game-keyboard>
		<div id="keyboard">
			<div class="row">
				<button on:click={() => keyboardEntry("q")}>q</button>
				<button on:click={() => keyboardEntry("w")}>w</button>
				<button on:click={() => keyboardEntry("e")}>e</button>
				<button on:click={() => keyboardEntry("r")}>r</button>
				<button on:click={() => keyboardEntry("t")}>t</button>
				<button on:click={() => keyboardEntry("y")}>y</button>
				<button on:click={() => keyboardEntry("u")}>u</button>
				<button on:click={() => keyboardEntry("i")}>i</button>
				<button on:click={() => keyboardEntry("o")}>o</button>
				<button on:click={() => keyboardEntry("p")}>p</button>
			</div>
			<div class="row">
				<div class="spacer half"></div>
				<button on:click={() => keyboardEntry("a")}>a</button>
				<button on:click={() => keyboardEntry("s")}>s</button>
				<button on:click={() => keyboardEntry("d")}>d</button>
				<button on:click={() => keyboardEntry("f")}>f</button>
				<button on:click={() => keyboardEntry("g")}>g</button>
				<button on:click={() => keyboardEntry("h")}>h</button>
				<button on:click={() => keyboardEntry("j")}>j</button>
				<button on:click={() => keyboardEntry("k")}>k</button>
				<button on:click={() => keyboardEntry("l")}>l</button>
				<div class="spacer half"></div>
			</div>
			<div class="row">
				<button class="one-and-a-half" on:click={() => keyboardEntry("Enter")}>enter</button>
				<button on:click={() => keyboardEntry("z")}>z</button>
				<button on:click={() => keyboardEntry("x")}>x</button>
				<button on:click={() => keyboardEntry("c")}>c</button>
				<button on:click={() => keyboardEntry("v")}>v</button>
				<button on:click={() => keyboardEntry("b")}>b</button>
				<button on:click={() => keyboardEntry("n")}>n</button>
				<button on:click={() => keyboardEntry("m")}>m</button>
				<button class="one-and-a-half" on:click={() => keyboardEntry("Backspace")}>
					<game-icon icon="backspace">
						<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
							<path fill="var(--color-tone-1)" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
						</svg>
					</game-icon>
				</button>
			</div>
		</div>
	</game-keyboard>
	<game-page style="display:{showInstructions ? "block":"none"}">
		<strong>HOW TO USE</strong>
		<game-help page slot="content">
			<section>
				<div class="instructions">
					<p>You should already know what <strong><a href="https://www.powerlanguage.co.uk/wordle/">WORDLE</a></strong> is if you're here. It's the word-game sensation by <a href="https://www.powerlanguage.co.uk/">Josh Wardle</a> taking the world by storm.</p>
					<p>This is a tool to help you pick the best next answer.</p>
					<p>After entering a word, click on the tiles to flip them to how they appear on Wordle.</p>
					<p>This website is purposefully "unplayable". It is just a tool to help you when you're stuck. If you want to play Wordle, go to the <a href="https://www.powerlanguage.co.uk/wordle/">THE OFFICIAL WEBSITE</a></p>
					<p>The interface is clunky and sloppy because I don't know what I'm doing.</p>
					<p><strong><a href="https://twitter.com/moodyhikmet">I'm on Twitter as well</a></strong></p>
					<p>You can find the source code for this site at this <strong><a href="https://github.com/sadmoody/unwordle-svelte">Github Repo</a></strong></p>
					<p>Yes if you use this website when you're playing - you're cheating. This is supposed to be a poor-man's Stockfish but for Wordle.</p>
				</div>
			</section>
		</game-help>
	</game-page>
</div>