// We're going to store everything in variables that reseble FEN notation
var chessboard = [
	"rnbqkbnr",
	"pppppppp",
	"        ",
	"        ",
	"        ",
	"        ",
	"PPPPPPPP",
	"RNBQKBRR"
];

var activeColor = "w";

var canCastle = {
	"K": true,
	"Q": true,
	"k": true,
	"q": true
};

var enPassant = "";

var halfMoveClock = 0;
var fullMoveClock = 1;

isOnBoard = function(rank, file) {
	// TODO: eventually include support for algebraic notation
  	if (rank >= 0 && rank <= 7 && file >= 0 && file <= 7) {
		return(true);
	} else {
		return(false);
	}
}

getColor = function(piece) {
	if (piece === " ") {
		return(undefined);
	}
	if (piece === piece.toUpperCase()){
		return("w");
	} else {
		return("b");
	}
}

fenToAn = function(rank, file) {
	var algebraic = String.fromCharCode(97 + file);
	algebraic += (8 - rank);
	return(algebraic);
}

getValidMoves = function(rank, file) {
	var possibleMoves = [
		[rank - 1, file - 1],
		[rank - 1, file],
		[rank - 1, file + 1],
		[rank, file - 1],
		[rank, file + 1],
		[rank + 1, file - 1],
		[rank + 1, file],
		[rank + 1, file + 1]
	];
	var validMoves = [];
	for (i = 0; i < possibleMoves.length; i++) {
		var pos = {r: possibleMoves[i][0], f: possibleMoves[i][1]};
		if (isOnBoard(pos.r, pos.f)
			&& activeColor !== getColor(chessboard[pos.r][pos.f])) {
			validMoves.push(fenToAn(pos.r, pos.f));
		}
	}
	return validMoves;
}
