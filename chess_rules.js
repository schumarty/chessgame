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
	var selPiece = this._getPiece(strPos);
	var updatedSquares = [];

	if (!this.canPlay(startAlg)) {
		return [];
	}

	var validMoves = this._getValidMoves(selPiece, strPos);

	var endIsValid = validMoves.some(function(square) {
		return square.r === endPos.r && square.f === endPos.f;
	});
	if (endIsValid) {
		var pieceHolder = this._getPiece(strPos);
		this.board[strPos.r][strPos.f] = ' ';
		this.board[endPos.r][endPos.f] = pieceHolder;
		updatedSquares.push(startAlg);
		updatedSquares.push(finishAlg);

		if (selPiece.toLowerCase() === 'p' &&
				finishAlg === this.enPassant) {
			var dir;
			this.activeColor === 'w' ? dir = -1 : dir = 1;
			this.board[endPos.r - dir][endPos.f] = ' ';
			updatedSquares.push(this._fenToAn({r: endPos.r -dir, f: endPos.f}));
		}

		if (selPiece.toLowerCase() === 'p' &&
				Math.abs(strPos.r - endPos.r) === 2) {
			var dir;
			this.activeColor === 'w' ? dir = -1 : dir = 1;
			this.enPassant = this._fenToAn({r: endPos.r - dir, f: endPos.f});
		} else {
			this.enPassant = '-';
		}
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

	return updatedSquares;
}

Chess.prototype.getMoves = function(alg) {
	var pos = this._anToFen(alg);
	var fenMoves = this._getValidMoves(pos);
	var anMoves = [];
	fenMoves.forEach(function(square) {
		anMoves.push(this._fenToAn(square));
	}, this);
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

Chess.prototype.canPlay = function(alg) {
	var pos = this._anToFen(alg);
	return this._getColor(this._getPiece(pos)) === this.activeColor;
}

Chess.prototype.getMoves = function(alg) {
	var pos = this._anToFen(alg);
	var piece = this._getPiece(pos);
	var moveList = [];

	this._getValidMoves(piece, pos).forEach(function(square) {
		moveList.push(this._fenToAn(square));
	}, this);

	return moveList;
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

Chess.prototype._getKingMoves = function(p) {
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
	possibleMoves.forEach(function(square) {
		if (this._isOnBoard(square) &&
				this.activeColor !== this._getColor(this._getPiece(square))) {
			validMoves.push(square);
		}
	}, this);
	return validMoves;
}

Chess.prototype._getKnightMoves = function(p) {
	var possibleMoves = [
		{r: p.r - 2, f: p.f - 1},
		{r: p.r - 2, f: p.f + 1},
		{r: p.r - 1, f: p.f - 2},
		{r: p.r - 1, f: p.f + 2},
		{r: p.r + 1, f: p.f - 2},
		{r: p.r + 1, f: p.f + 2},
		{r: p.r + 2, f: p.f - 1},
		{r: p.r + 2, f: p.f + 1}
	];
	var validMoves = [];
	possibleMoves.forEach(function(square) {
		if (this._isOnBoard(square) &&
				this.activeColor !== this._getColor(this._getPiece(square))) {
			validMoves.push(square);
		}
	}, this);
	return validMoves;
}

Chess.prototype._generateRay = function(pos, rStep, fStep) {
	possibleMoves = [];
	p = {
		r: pos.r,
		f: pos.f
	};

	do {
		p.r += rStep;
		p.f += fStep;

		if (this._isOnBoard(p) &&
				this.activeColor !== this._getColor(this._getPiece(p))) {
			possibleMoves.push({r: p.r, f:p.f});
		}
	} while (this._isOnBoard(p) && this._getPiece(p) === ' ');

	return possibleMoves;
}

Chess.prototype._getRookMoves = function(p) {
	var possibleMoves = [];
	possibleMoves = possibleMoves.concat(this._generateRay(p, 1, 0));
	possibleMoves = possibleMoves.concat(this._generateRay(p, -1, 0));
	possibleMoves = possibleMoves.concat(this._generateRay(p, 0, 1));
	possibleMoves = possibleMoves.concat(this._generateRay(p, 0, -1));

	return possibleMoves;
}

Chess.prototype._getBishopMoves = function(p) {
	var possibleMoves = [];
	possibleMoves = possibleMoves.concat(this._generateRay(p, 1, 1));
	possibleMoves = possibleMoves.concat(this._generateRay(p, 1, -1));
	possibleMoves = possibleMoves.concat(this._generateRay(p, -1, 1));
	possibleMoves = possibleMoves.concat(this._generateRay(p, -1, -1));

	return possibleMoves;
}

Chess.prototype._getQueenMoves = function(p) {
	var possibleMoves = [];
	possibleMoves = possibleMoves.concat(this._generateRay(p, 1, 0));
	possibleMoves = possibleMoves.concat(this._generateRay(p, -1, 0));
	possibleMoves = possibleMoves.concat(this._generateRay(p, 0, 1));
	possibleMoves = possibleMoves.concat(this._generateRay(p, 0, -1));
	possibleMoves = possibleMoves.concat(this._generateRay(p, 1, 1));
	possibleMoves = possibleMoves.concat(this._generateRay(p, 1, -1));
	possibleMoves = possibleMoves.concat(this._generateRay(p, -1, 1));
	possibleMoves = possibleMoves.concat(this._generateRay(p, -1, -1));

	return possibleMoves;
}

Chess.prototype._getPawnMoves = function(p) {
	var possibleMoves = [];
	var rankDir, startRank, enemyColor, testPos;
	
	if (this.activeColor === 'w') {
		rankDir = -1;
		startRank = 6;
		enemyColor = 'b';
	} else {
		rankDir = 1;
		startRank = 1;
		enemyColor = 'w';
	}
	
// Test if the pawn can move forward
	testPos = {r: p.r + rankDir, f: p.f};
	if (this._getPiece(testPos) === ' ') {
		possibleMoves.push(testPos);
		testPos = {r: p.r + (2 * rankDir), f: p.f};
		if (p.r === startRank && this._getPiece(testPos) === ' ') {
			possibleMoves.push(testPos);
		}
	}

// Find squares that the pawn can capture
	[-1, 1].forEach(function(fileDir) {
		testPos = {r: p.r + rankDir, f: p.f + fileDir};
		if (this._isOnBoard(testPos) &&
				this._getColor(this._getPiece(testPos)) === enemyColor) {
			possibleMoves.push(testPos);
		} else if (this.enPassant !== '-') {
			var pasPos = this._anToFen(this.enPassant);
			if (testPos.r === pasPos.r && testPos.f === pasPos.f) {
				possibleMoves.push(testPos);
			}
		}
	}, this);

	return possibleMoves;
}

Chess.prototype._getValidMoves = function(selPiece, strPos) {
	var validMoves = [];

	if (selPiece === 'n' || selPiece === 'N') {
		validMoves = this._getKnightMoves(strPos);
	} else if (selPiece === 'r' || selPiece === 'R') {
		validMoves = this._getRookMoves(strPos);
	} else if (selPiece === 'b' || selPiece === 'B') {
		validMoves = this._getBishopMoves(strPos);
	} else if (selPiece === 'q' || selPiece === 'Q') {
		validMoves = this._getQueenMoves(strPos);
	} else if (selPiece === 'p' || selPiece === 'P') {
		validMoves = this._getPawnMoves(strPos);
	} else if (selPiece === 'k' || selPiece === 'K') {
		validMoves = this._getKingMoves(strPos);
	}

	return validMoves;
}
