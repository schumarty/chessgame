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
}

/*
 These are the functions used to interact with the object
 All board positions in and out of the functions use algebraic notation
*/

Chess.prototype.play = function(startAlg, finishAlg, promotion) {
	var strPos = this._anToFen(startAlg);
	var endPos = this._anToFen(finishAlg);
	var selPiece = this._getPiece(strPos);
	var updatedSquares = [];
	var backrank = (this.activeColor === 'w') ? 7 : 0;
	var lastRank = (this.activeColor === 'w') ? 0 : 7;
	var dir = (this.activeColor === 'w') ? -1 : 1;

	if (!this.canPlay(startAlg)) {
		return [];
	}

	var validMoves = this._getValidMoves(selPiece, strPos);

	var endIsValid = validMoves.some(function(square) {
		return square.r === endPos.r && square.f === endPos.f;
	});
	if (endIsValid) {
		this.board[endPos.r][endPos.f] = this.board[strPos.r][strPos.f];
		this.board[strPos.r][strPos.f] = ' ';
		updatedSquares.push(startAlg, finishAlg);

		if (selPiece.toLowerCase() === 'p' &&
				finishAlg === this.enPassant) {
			this.board[endPos.r - dir][endPos.f] = ' ';
			updatedSquares.push(this._fenToAn({r: endPos.r -dir, f: endPos.f}));
		}

		if (selPiece.toLowerCase() === 'p' &&
				Math.abs(strPos.r - endPos.r) === 2) {
			this.enPassant = this._fenToAn({r: endPos.r - dir, f: endPos.f});
		} else {
			this.enPassant = '-';
		}

		if (selPiece.toLowerCase() === 'p' &&
				endPos.r === lastRank) {
			promotion = (this.activeColor === 'w') ? 
				promotion.toUpperCase() :
				promotion.toLowerCase()
			;

			this.board[endPos.r][endPos.f] = promotion;
		}

		if (selPiece.toLowerCase() === 'r') {
			if (strPos.r === backrank && strPos.f === 0) {
				this._removeCastleRight('q');
			} else if (strPos.r === backrank && strPos.f === 7) {
				this._removeCastleRight('k');
			}
		}

		if (selPiece.toLowerCase() === 'k' &&
				strPos.r === backrank && strPos.f === 4) {
			this._removeCastleRight('q');
			this._removeCastleRight('k');
			
			if (endPos.f === 2) {
				this.board[backrank][3] = this.board[backrank][0];
				this.board[backrank][0] = ' ';
				updatedSquares.push(this._fenToAn({r: backrank, f: 3}),
						this._fenToAn({r:backrank, f: 0}));
			} else if (endPos.f === 6) {
				this.board[backrank][5] = this.board[backrank][7];
				this.board[backrank][7] = ' ';
				updatedSquares.push(this._fenToAn({r: backrank, f: 5}),
						this._fenToAn({r:backrank, f: 7}));
			}
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

	if (this._testCheck()) {
		console.log("check!");
	}

	return updatedSquares;
};

Chess.prototype.getFen = function() {
	var string = this._boardString() + 
			' ' + this.activeColor +
			' ' + this.castle +
			' ' + this.enPassant +
			' ' + this.halfMoveClock +
			' ' + this.fullMoveNumber;
	return string;
};

Chess.prototype.pieceAt = function(alg) {
	var pos = this._anToFen(alg);
	return this._getPiece(pos);
};

Chess.prototype.pieceColor = function(alg) {
	var pos = this._anToFen(alg);
	var color = this._getColor(this._getPiece(pos));
	return color;
};

Chess.prototype.canPlay = function(alg) {
	var pos = this._anToFen(alg);
	return this._getColor(this._getPiece(pos)) === this.activeColor;
};

Chess.prototype.getMoves = function(alg) {
	var pos = this._anToFen(alg);
	var piece = this._getPiece(pos);
	var moveList = [];

	this._getValidMoves(piece, pos).forEach(function(square) {
		moveList.push(this._fenToAn(square));
	}, this);

	return moveList;
};

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
};

Chess.prototype._isOnBoard = function(p) {
	if (p.r >= 0 && p.r < this.board.length && 
			p.f >= 0 && p.f < this.board[0].length) {
		return true;
	} else {
		return false;
	}
};

Chess.prototype._getPiece = function(p) {
	return this.board[p.r][p.f];
};

Chess.prototype._getColor = function(piece) {
	if (piece === ' ') {
		return undefined;
	}
	return (piece === piece.toUpperCase()) ? 'w' : 'b';
};

Chess.prototype._fenToAn = function(p) {
	var algebraic = String.fromCharCode(97 + p.f);
	algebraic += 8 - parseInt(p.r);
	return algebraic;
};

Chess.prototype._anToFen = function(algebraic) {
	var file = algebraic[0].charCodeAt(0) - 97;
	var rank = 8 - algebraic[1];
	return {r: rank, f: file};
};

Chess.prototype._removeCastleRight = function(castleChar) {
	if (this.activeColor === 'w') {
		castleChar = castleChar.toUpperCase();
	} else {
		castleChar = castleChar.toLowerCase();
	}

	this.castle = this.castle.replace(castleChar, '');

	if (this.castle === '') {
		this.castle = '-';
	}
};

Chess.prototype._checkCastleRight = function(castleChar) {
	if (this.activeColor === 'w') {
		castleChar = castleChar.toUpperCase();
	} else {
		castleChar = castleChar.toLowerCase();
	}

	return this.castle.split('').some(function(c) {
		return c === castleChar;
	});
};

Chess.prototype._findKing = function(color) {
	if (!color) {
		color = this.activeColor;
	}

	var king = (color === 'w') ? 'K' : 'k';

	for (var r = 0; r < this.board.length; r++) {
		for (var f = 0; f < this.board[r].length; f++) {
			if (this.board[r][f] === king) {
				return {r: r, f: f};
			}
		}
	}
};

Chess.prototype._testCheck = function() {
	var kingIsChecked = false;
	var kingLoc = this._findKing();
	var rankDir = (this.activeColor === 'w') ? -1 : 1;

	kingIsChecked = this._getKingMoves(kingLoc).some(function(square) {
		return this._getPiece(square).match(/k/i);
	}, this);
	if (kingIsChecked) {
		return true;
	}

	kingIsChecked = this._getKnightMoves(kingLoc).some(function(square) {
		return this._getPiece(square).match(/n/i);
	}, this);
	if (kingIsChecked) {
		return true;
	}

	kingIsChecked = this._getBishopMoves(kingLoc).some(function(square) {
		return this._getPiece(square).match(/b|q/i);
	}, this);
	if (kingIsChecked) {
		return true;
	}

	kingIsChecked = this._getRookMoves(kingLoc).some(function(square) {
		return this._getPiece(square).match(/r|q/i);
	}, this);
	if (kingIsChecked) {
		return true;
	}

	[-1, 1].forEach(function(fileDir) {
		var testPos = {r: kingLoc.r + rankDir, f: kingLoc.f + fileDir};
		var enemyPawn = (this.activeColor === 'w') ? 'p' : 'P';

		if (this._isOnBoard(testPos) &&
				this._getPiece(testPos) === enemyPawn) {
			kingIsChecked = true;
		}
	}, this);
	if (kingIsChecked) {
		return true;
	}

};

Chess.prototype._getKingMoves = function(p) {
	var backrank = (this.activeColor === 'w') ? 7 : 0;

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

	if (this._checkCastleRight('k') &&
			this._getPiece({r: backrank, f: 5}) === ' ' &&
			this._getPiece({r: backrank, f: 6}) === ' ') {
		validMoves.push({r: backrank, f: 6});
	}
	if (this._checkCastleRight('q') &&
			this._getPiece({r: backrank, f: 3}) === ' ' &&
			this._getPiece({r: backrank, f: 2}) === ' ' &&
			this._getPiece({r: backrank, f: 1}) === ' ') {
		validMoves.push({r: backrank, f: 2});
	}
			
	return validMoves;
};

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
};

Chess.prototype._generateRay = function(pos, rStep, fStep) {
	var possibleMoves = [];
	var p = {
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
};

Chess.prototype._getRookMoves = function(p) {
	var possibleMoves = [];
	possibleMoves = possibleMoves.concat(this._generateRay(p, 1, 0));
	possibleMoves = possibleMoves.concat(this._generateRay(p, -1, 0));
	possibleMoves = possibleMoves.concat(this._generateRay(p, 0, 1));
	possibleMoves = possibleMoves.concat(this._generateRay(p, 0, -1));

	return possibleMoves;
};

Chess.prototype._getBishopMoves = function(p) {
	var possibleMoves = [];
	possibleMoves = possibleMoves.concat(this._generateRay(p, 1, 1));
	possibleMoves = possibleMoves.concat(this._generateRay(p, 1, -1));
	possibleMoves = possibleMoves.concat(this._generateRay(p, -1, 1));
	possibleMoves = possibleMoves.concat(this._generateRay(p, -1, -1));

	return possibleMoves;
};

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
};

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
};

Chess.prototype._getValidMoves = function(selPiece, strPos) {
	var possibleMoves = [];
	var validMoves = [];
	var endPiece;

	if (selPiece === 'n' || selPiece === 'N') {
		possibleMoves = this._getKnightMoves(strPos);
	} else if (selPiece === 'r' || selPiece === 'R') {
		possibleMoves = this._getRookMoves(strPos);
	} else if (selPiece === 'b' || selPiece === 'B') {
		possibleMoves = this._getBishopMoves(strPos);
	} else if (selPiece === 'q' || selPiece === 'Q') {
		possibleMoves = this._getQueenMoves(strPos);
	} else if (selPiece === 'p' || selPiece === 'P') {
		possibleMoves = this._getPawnMoves(strPos);
	} else if (selPiece === 'k' || selPiece === 'K') {
		possibleMoves = this._getKingMoves(strPos);
	}

// Messing with board like this seams messy to me but I have yet to come up
// with a better way of removing illegal moves due to self-checking.
	possibleMoves.forEach(function(endPos) {
		endPiece = this._getPiece(endPos);
		this.board[strPos.r][strPos.f] = ' ';
		this.board[endPos.r][endPos.f] = selPiece;
		if (!this._testCheck()) {
// Ensure king doesn't pass through check during castling moves
// Ok this is a little insane but... it works!
			if (selPiece.match(/k/i) &&
					Math.abs(strPos.f - endPos.f) > 1) {
				var direction = (strPos.f < endPos.f) ? 1 : -1;
				this.board[strPos.r][strPos.f + direction] = selPiece;
				this.board[endPos.r][endPos.f] = ' ';
				if (!this._testCheck()) {
					validMoves.push(endPos);
				}
				this.board[strPos.r][strPos.f + direction] = ' ';
			} else {
				validMoves.push(endPos);
			}
		}
		this.board[strPos.r][strPos.f] = selPiece;
		this.board[endPos.r][endPos.f] = endPiece;
	}, this);

	return validMoves;
};
