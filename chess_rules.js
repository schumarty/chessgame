function Chess() {
/*
 We're going to store everything in variables that reseble FEN notation
*/
	this.board = [
		['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
		['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
	];

	this.activeColor = 'w';

	this.castle = 'KQkq';

	this.enPassant = '-';

	this.halfMoveClock = 0;
	this.fullMoveNumber = 1;
};

/*
 These are the functions used to interact with the object
 All board positions in and out of the functions use algebraic notation
*/

Chess.prototype.play = function(startAlg, finishAlg) {
	var strPos = this._anToFen(startAlg);
	var endPos = this._anToFen(finishAlg);
	var validMoves = this._getValidMoves(strPos);

	if (this._getColor(this._getPiece(strPos)) !== this.activeColor) {
		return [];
	}

	var endIsValid = false;
	for (var i = 0; i < validMoves.length; i++) {
		if (validMoves[i].r === endPos.r &&
				validMoves[i].f === endPos.f) {
			endIsValid = true;
		}
	}
	if (endIsValid) {
		var pieceHolder = this._getPiece(strPos);
		this.board[strPos.r][strPos.f] = ' ';
		this.board[endPos.r][endPos.f] = pieceHolder;
	} else {
		return [];
	}

	this.halfMoveClock += 1;
	if (this.activeColor === 'b') {
		this.activeColor = 'w';
		this.fullMoveNumber += 1;
	} else {
		this.activeColor = 'b';
	}

	return [startAlg, finishAlg];
}

Chess.prototype.getMoves = function(alg) {
	var pos = this._anToFen(alg);
	var fenMoves = this._getValidMoves(pos);
	var anMoves = [];
	for (var i = 0; i < fenMoves.length; i++) {
		anMoves.push(this._fenToAn(fenMoves[i]));
	}
	return anMoves;
}

Chess.prototype.getFen = function() {
	string = this._boardString() + 
			' ' + this.activeColor +
			' ' + this.castle +
			' ' + this.enPassant +
			' ' + this.halfMoveClock +
			' ' + this.fullMoveNumber;
	return string;
}

Chess.prototype.pieceAt = function(alg) {
	var pos = this._anToFen(alg);
	return this._getPiece(pos);
}

Chess.prototype.pieceColor = function(alg) {
	var pos = this._anToFen(alg);
	var color = this._getColor(this._getPiece(pos));
	return color;
}

/*
 These are helper functions for the internal dirty work
 All inputs and outputs describing board position use object of coordinates
*/

Chess.prototype._boardString = function() {
	var string = '';
	for (var i = 0; i < this.board.length; i++) {
		for (var j = 0; j < this.board[i].length; j++) {
			if (this.board[i][j] === ' ') {
				var lastChar = string.slice(-1);
				if (lastChar.match(/[1-8]/)) {
					string = string.substring(0, string.length - 1);
					string += parseInt(lastChar) + 1;
				} else {
					string += '1';
				}
			} else {
				string += this.board[i][j];
			}
		}
		if (i < this.board.length - 1) {
			string += '/';
		}
	}
	return string;
}

Chess.prototype._isOnBoard = function(p) {
	if (p.r >= 0 && p.r < this.board.length && 
			p.f >= 0 && p.f < this.board[0].length) {
		return true;
	} else {
		return false;
	}
}

Chess.prototype._getPiece = function(p) {
	return this.board[p.r][p.f];
}

Chess.prototype._getColor = function(piece) {
	if (piece === ' ') {
		return undefined;
	}
	if (piece === piece.toUpperCase()){
		return 'w';
	} else {
		return 'b';
	}
}

Chess.prototype._fenToAn = function(p) {
	var algebraic = String.fromCharCode(97 + p.f);
	algebraic += 8 - parseInt(p.r);
	return algebraic;
}

Chess.prototype._anToFen = function(algebraic) {
	var file = algebraic[0].charCodeAt(0) - 97;
	var rank = 8 - algebraic[1];
	return {r: rank, f: file};
}

Chess.prototype._getValidMoves = function(p) {
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
	for (var i = 0; i < possibleMoves.length; i++) {
		var pos = possibleMoves[i];
		if (this._isOnBoard(pos) && 
				this.activeColor !== this._getColor(this._getPiece(pos))) {
			validMoves.push(pos);
		}
	}
	return validMoves;
}
