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

cssToPos = function(cssSel) {
	var result = cssSel.match(/\.rank_(\d) > \.file_([a-hA-H])/);

	return(result[2] + result[1]);
}
