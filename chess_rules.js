Chess = function() {
// We're going to store everything in variables that reseble FEN notation
	this.board = [
		"rnbqkbnr",
		"pppppppp",
		"        ",
		"        ",
		"        ",
		"        ",
		"PPPPPPPP",
		"RNBQKBRR"
	];

	this.activeColor = "w";

	this.canCastle = {
		"K": true,
		"Q": true,
		"k": true,
		"q": true
	};

	this.enPassant = "";

	this.halfMoveClock = 0;
	this.fullMoveClock = 1;

// These are the functions used to interact with the object
// All board positions in and out of the functions use algebraic notation

	this.getMoves = function(alg) {
		var pos = this._anToFen(alg);
		var fenMoves = this._getValidMoves(pos.r, pos.f);
		var anMoves = [];
		for (i = 0; i < fenMoves.length; i++) {
			anMoves.push(this._fenToAn(fenMoves[i]));
		}
		return(anMoves);
	}

// These are helper functions for the internal dirty work
// All inputs and outputs describing board position use object of coordinates

	this._isOnBoard = function(rank, file) {
		if (rank >= 0 && rank < this.board.length
			&& file >= 0 && file < this.board[0].length)
		{
			return(true);
		} else {
			return(false);
		}
	}

	this._getColor = function(piece) {
		if (piece === " ") {
			return(undefined);
		}
		if (piece === piece.toUpperCase()){
			return("w");
		} else {
			return("b");
		}
	}

	this._fenToAn = function(posObj) {
		var algebraic = String.fromCharCode(97 + posObj.f);
		algebraic += 8 - parseInt(posObj.r);
		return(algebraic);
	}
	
	this._anToFen = function(algebraic) {
		var file = (algebraic[0].charCodeAt(0) - 97);
		var rank = 8 - algebraic[1];
		return({r: rank, f: file});
	}

	this._getValidMoves = function(rank, file) {
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
			if (this._isOnBoard(pos.r, pos.f)
				&& this.activeColor !== this._getColor(this.board[pos.r][pos.f]))
			{
				validMoves.push(pos);
			}
		}
		return validMoves;
	}
};
