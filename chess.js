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

// placeholder for piece if one is selected
var piece = {
	html: "",
	boardPosition: ""
};
$(document).ready(function () {
	$("td").click(function () {
		// only the selected spot will be orange
		$("td").each(function() {
			this.removeAttribute("style");
		});

		if (piece.html) {
			var newPosition = cssToPos(this.className, this.parentElement.className);

			var capturedPiece = this.childNodes[0];
			if (capturedPiece && newPosition !== piece.boardPosition) {
				if (capturedPiece.className.match(/black/)) {
					$(capturedPiece).clone().appendTo($(".black.pieces_info"));
				} else if (capturedPiece.className.match(/white/)) {
					$(capturedPiece).clone().appendTo($(".white.pieces_info"));
				}
			}

			movePiece(piece.boardPosition, newPosition);
			piece.html = "";
		} else {
			piece.html = $(this).html();
			// only hightlight spot if it contains a piece we can move
			if (piece.html) {$(this).css("background-color", "orange");}
			piece.boardPosition = cssToPos(this.className, this.parentElement.className);
		}
	});
});
