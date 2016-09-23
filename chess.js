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

	if (piece === " ") {
		$(selector).html("");
	} else {
		var newImg = document.createElement("img");
		newImg.src = "pieces/" + piece + ".png";
		newImg.alt = piece;
		newImg.className = color + " piece";
		$(selector).html(newImg);
	}
}

refreshBoard = function() {
	var rankArray = ["1", "2", "3", "4", "5", "6", "7", "8"];
	var fileArray = ["a", "b", "c", "d", "e", "f", "g", "h"];
	fileArray.forEach(function(file) {
		rankArray.forEach(function(rank) {
			updateSquare(file + rank);
		});
	});
}

openPromotionBox = function(oldSqr, selSqr, capturedPiece) {
	$(".promo_popup").show();
	$("#promo_ok").click({start:oldSqr, finish:selSqr},function(ev) {
		var promotionPiece = $("input[name=promotion]:checked").val();
		console.log(ev.data.start + " " + ev.data.finish + " " + promotionPiece);
		playMove(ev.data.start, ev.data.finish, promotionPiece);
		$(".promo_popup").hide();
	});
}

/*
*	Wrapper for the chess opjects capture method
*/
playMove = function(start, finish, promotion) {
	var capturedPiece = $(posToCss(finish)).html();
	var squaresToUpdate = chess.play(start, finish, promotion)
// Messy hack to register pieces captured en passant
	if (squaresToUpdate.length === 3) {
		capturedPiece = $(posToCss(squaresToUpdate[2])).html();
	}
	squaresToUpdate.forEach(function(square) {
		updateSquare(square);
	});

// if squaresToUpdate is 0 the selected piece hasn't actually been captured
	if (capturedPiece && squaresToUpdate.length > 0) {
		if ($(capturedPiece).hasClass("white")) {
			$(".white.pieces_info").append(capturedPiece);
		} else if ($(capturedPiece).hasClass("black")) {
			$(".black.pieces_info").append(capturedPiece);
		}
	}
}	

// placeholder for piece if one is selected
var oldSqr = "";

$(document).ready(function () {
	//initialize chess object
	chess = new Chess;

	// initialize the board
	refreshBoard()

	$("td").click(function () {
		// only the selected spot will be orange
		$("td").each(function() {
			this.removeAttribute("style");
		});

		var selSqr = cssToPos(this.className, this.parentElement.className);

		if (oldSqr) {

			if (chess.pieceAt(oldSqr).toLowerCase() === "p" &&
					selSqr.match(/1|8/)) {
				console.log("open promo box");
				openPromotionBox(oldSqr, selSqr);
			} else {
				playMove(oldSqr, selSqr);
			}

			oldSqr = "";
		} else {
			if (chess.canPlay(selSqr)) {
				oldSqr = selSqr;
				$(this).css("background-color", "orange");
				
				chess.getMoves(selSqr).forEach(function(square) {
					$(posToCss(square)).css("background-color", "yellow");
				});
			}

		}
	});
});
