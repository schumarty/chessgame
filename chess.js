movePiece = function(start, finish) {
	// convert board positions into CSS selectors
	var startSel = '.rank_' + start.split("")[1] + ' > .file_' + start.split("")[0];
	var finishSel = '.rank_' + finish.split("")[1] + ' > .file_' + finish.split("")[0];

	// move piece and clear its old position
	var piece = $(startSel).html();
	$(startSel).html("");
	$(finishSel).html(piece);
}

