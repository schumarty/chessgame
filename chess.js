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
	return('.rank_' + position.split("")[1] + ' > .file_' + position.split("")[0]);
}

cssToPos = function(file, rank) {
	var result = file.match(/file_([a-hA-H])/)[1]
		+rank.match(/rank_(\d)/)[1];

	return(result);
}

// placeholder for piece if one is selected
var piece = {
	html: "",
	boardPosition: ""
};
$("td").click(function () {
	// only the selected spot will be orange
	$("td").each(function() {
		this.removeAttribute("style");
	});
	$(this).css("background-color", "orange");

	if (piece.html) {
		var newPosition = cssToPos(this.className, this.parentElement.className);
		// show that piece has been de-selected
		if (newPosition === piece.boardPosition) {
			this.removeAttribute("style");
		}
		movePiece(piece.boardPosition, newPosition);
		piece.html = "";
	} else {
		piece.html = $(this).html();
		piece.boardPosition = cssToPos(this.className, this.parentElement.className);
	}
});
