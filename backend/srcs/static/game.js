//const { SignalCellularConnectedNoInternet0BarOutlined } = require("@material-ui/icons");

const wordChain = () => {
	let inputWord = document.getElementById("wordchain_input_box").value
	let currentWord = document.getElementById("wordchain_current_word").innerText
	
	let lastWord = currentWord[currentWord.length - 1];
	let firstWord = inputWord[0];

	if (lastWord === firstWord)
	{
		document.getElementById("wordchain_result").innerText = "정답입니다!"
		document.getElementById("wordchain_current_word").innerText = inputWord;
		document.getElementById("wordchain_input_box").value = "";
	}
	else
	{
		document.getElementById("wordchain_result").innerText = "땡!"
		document.getElementById("wordchain_input_box").value = "";
	}
};

const lotto = () => {
	let lottoNum = document.querySelectorAll("#lotto_num_box span");
	let randomSet = new Set();
	for(i = 0; i < 6; i++){
		randomSet.add(Math.floor(Math.random() * 45) + 1)
	}
	let sortNums = Array.from(randomSet).sort((a, b) => a - b);
	lottoNum.forEach((span, index) => {
		span.innerText = sortNums[index];
	});
};

