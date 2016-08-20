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
		"RNBQKBNR"
	];

	this.activeColor = "w";

	this.castle = "KQkq";

	this.enPassant = "-";

	this.halfMoveClock = 0;
	this.fullMoveClock = 1;

// These are the functions used to interact with the object
// All board positions in and out of the functions use algebraic notation

	this.getMoves = function(alg) {
		var pos = this._anToFen(alg);
		var fenMoves = this._getValidMoves(pos);
		var anMoves = [];
		for (i = 0; i < fenMoves.length; i++) {
			anMoves.push(this._fenToAn(fenMoves[i]));
		}
		return(anMoves);
	}

	this.getFen = function() {
		string = this._boardString()
			+ " " + this.activeColor
			+ " " + this.castle
			+ " " + this.enPassant
			+ " " + this.halfMoveClock
			+ " " + this.fullMoveClock
		;
		return(string);
	}

// These are helper functions for the internal dirty work
// All inputs and outputs describing board position use object of coordinates

	this._boardString = function() {
		var string = "";
		for (i = 0; i < this.board.length; i++) {
			for (j = 0; j < this.board[i].length; j++) {
				if (this.board[i][j] === " ") {
					var lastChar = string.slice(-1);
					if (lastChar.match(/[1-8]/)) {
						console.log("match");
						string = string.substring(0, string.length - 1);
						string += parseInt(lastChar) + 1;
					} else {
						string += "1";
					}
				} else {
					string += this.board[i][j];
				}
			}
			if (i < this.board.length - 1) {
				string += "/";
			}
		}
		return(string);
	}

	this._isOnBoard = function(p) {
		if (p.r >= 0 && p.r < this.board.length
			&& p.f >= 0 && p.f < this.board[0].length)
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

	this._fenToAn = function(p) {
		var algebraic = String.fromCharCode(97 + p.f);
		algebraic += 8 - parseInt(p.r);
		return(algebraic);
	}
	
	this._anToFen = function(algebraic) {
		var file = (algebraic[0].charCodeAt(0) - 97);
		var rank = 8 - algebraic[1];
		return({r: rank, f: file});
	}

	this._getValidMoves = function(p) {
		var possibleMoves = [
			{r: p.r - 1, f: p.f - 1},
			{r: p.r - 1, f: p.f},
			{r: p.r - 1, f: p.f + 1},
			{r: p.r,     f: p.f - 1},
			{r: p.r,     f: p.f + 1},
			{r: p.r + 1, f: p.f - 1},
			{r: p.r + 1, f: p.f},
			{r: p.r + 1, f: p.f + 1}
		];
		var validMoves = [];
		for (i = 0; i < possibleMoves.length; i++) {
			var pos = possibleMoves[i];
			if (this._isOnBoard(pos)
				&& this.activeColor !== this._getColor(this.board[pos.r][pos.f]))
			{
				validMoves.push(pos);
			}
		}
		return validMoves;
	}
};
