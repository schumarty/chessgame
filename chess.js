movePiece = function(start, finish) {
	// convert board positions into CSS selectors
	var startSel = posToCss(start);
	var finishSel = posToCss(finish);

	// move piece and clear its old position
	var piece = $(startSel).html();
	$(startSel).html("");
	$(finishSel).html(piece);
}

posToCss = function(position) {
	return('.rank_' + position[1] + ' > .file_' + position[0]);
}

cssToPos = function(file, rank) {
	var result = file.match(/file_([a-hA-H])/)[1]
		+rank.match(/rank_(\d)/)[1];

	return(result);
}

updateSquare = function(square) {
	var selector = posToCss(square);
	var piece = chess.pieceAt(square);
	var colorAbbr = chess.pieceColor(square);
	var color = "";
	if (colorAbbr === "w") {
		color = "white";
	} else if (colorAbbr === "b") {
		color = "black";
	}
	var newSpan = document.createElement("span");
	newSpan.className = color;
	newSpan.innerHTML = piece;
	$(selector).html(newSpan);
}

// placeholder for piece if one is selected
var oldSqr = "";

$(document).ready(function () {
	//initialize chess object
	chess = new Chess;

	// initialize the board
	var rankArray = ["1", "2", "3", "4", "5", "6", "7", "8"];
	var fileArray = ["a", "b", "c", "d", "e", "f", "g", "h"];
	fileArray.forEach(function(file) {
		rankArray.forEach(function(rank) {
			updateSquare(file + rank);
		});
	});

	$("td").click(function () {
		// only the selected spot will be orange
		$("td").each(function() {
			this.removeAttribute("style");
		});

		var selSqr = cssToPos(this.className, this.parentElement.className);

		if (oldSqr) {
			chess.play(oldSqr, selSqr).forEach(function(square) {
				updateSquare(square);
			});
			
			oldSqr = "";
		} else {
			if (chess.canPlay(selSqr)) {
				oldSqr = selSqr;
				$(this).css("background-color", "orange");
			}

		}
	});
});
