var board = null;

function shuffle(s) {
	for (var i = 0; i < s.length; ++i) {
		var x = parseInt(Math.random() * s.length);
		var y = parseInt(Math.random() * s.length);
		if (x == y)
			continue;
		var tmp = s[x];
		s[x] = s[y];
		s[y] = tmp;
	}
	return s;
}

function Group(){
	this.values = [10];
	
	// init the values to 0
	for (var i = 1; i != 10; ++i ){
		this.values[i] = 0;
	}
	
	this.addValue = function(num) {++this.values[num];}
	this.delValue = function(num) {--this.values[num];}
	
	this.valid = function(){
		for(var i = 1; i != 10; ++i){
			if (this.values[i] > 1){
				return false;
			} else {
				return true;
			}
		}
	}
	
	this.complete = function(){
		for(var i = 1; i != 10; ++i){
			if (this.values[i] != 1){
				return false
			} else {
				return true;
			}
		}
	}
}// End Group

function Space(){
	this.value_ = 0;
	this.fixed_ = false;
	
	this.toChar = function(){return this.value_ == 0 ? '' : this.toString();}
	
	this.row = null;
	this.col = null;
	
	this.setValue = function(n){
		
		alert("setting: " + n);
		
		if(parseInt(n) < 0 || parseInt(n) > 9){
			alert(n);
		}
		
		if (this.value_ != 0){
			this.row.delValue(n);
			this.col.delValue(n);
			this.grp.delValue(n);
		}
		
		this.value_ = n;
		
		if (this.value_ != 0){
			this.row.addValue(n);
			this.col.addValue(n);
			this.grp.addValue(n);
		}
	}
	
	this.getValue = function(){ return this.value_;}
	
	this.valid = function(){
		return this.row.valid() && this.col.valid() && this.grp.valid();
	}
	
	this.fixed = function(){ return this.fixed_;}
	this.fix = function(){ this.fixed_ = true;}
	this.clear = function(){this.setValue(0); this.fixed_ = false;}
	
}// End Space

function Board(){
	this.cols = [9];
	this.rows = [9];
	this.grps = [9];
	
	// init the cols rows and grps
	for(var i = 0; i < 9; ++i){
		this.cols[i] = new Group();
		this.rows[i] = new Group();
		this.grps[i] = new Group();
	}
	
	this.spaces = [9];
	
	// associate the spaces in the arrays with the
	// correct rows, columns, and groups
	for(var y = 0; y < 9; ++y){
		this.spaces[y] = [9];
		for(var x = 0; x < 9; ++x){
			this.spaces[y][x] = new Space();
			this.spaces[y][x].row = this.rows[x];
			this.spaces[y][x].col = this.cols[y];
			this.spaces[y][x].grp = this.grps[(parseInt(x / 3) + parseInt(y / 3) * 3)]
		}
	}
	
	this.setValue = function(x, y, num){
		if(this.spaces[y][x].fixed()){
			return false;
		} else {
			this.spaces[y][x].setValue(num);
		}
	}
	
	this.getValue = function(x, y){
		return this.spaces[y][x].getValue();
	}
	
	this.toChar = function(x,y){
		return this.spaces[y][x].toChar();
	}
	
	this.reset = function(){
		for(var y = 0; y < 9; ++y){
			for(var x = 0; x < 9; ++x){
				if(!(this.spaces[y][x].fixed())){
					this.spaces[y][x].clear();
				}
			}
		}
	}
	
	this.fix = function(){
		for(var y = 0; y < 9; ++y){
			for(var x = 0; x < 9; ++x){
				if(this.spaces[y][x].getValue() != 0){
					this.spaces[y][x].fix();
				}
			}
		}
	}

	
	this.valid = function(){
		for(var i = 0; i < 9; ++i){
			if(!(this.rows[i].valid() && this.cols[i].valid() && this.grps[i].valid())){
				return false;
			}
		}
		return true;
	}
	
	this.complete = function(){
		for (var i = 0; i < 9; ++i){
			if(!(this.rows[i].complete() && this.cols[i].complete())){
				return false;
			}
		}
		return true;
	}
	
	this.getSpaces_ = function(){
		var s = [];
		for(var y = 0; y < 9; ++y){
			for(var x = 0; x < 9; ++x){
				s.push(this.spaces[y][x]);
			}
		}
		return s;
	}
	this.solve_ = function(s, idx, unique) {
		if (idx >= s.length) {
			if (board.valid()) {
				++this.numSolutions_;
				return true;
			}
			return false;
		}

		if (s[idx].getValue() != 0)
			return this.solve_(s, idx + 1, unique);

		var initValue = s[idx].getValue()

		for (var i = 1; i < 10; ++i) {
			s[idx].setValue(i);
			if (s[idx].valid() && this.solve_(s, idx + 1, unique)) { 
				if (!unique || this.numSolutions_ >= 2) {
					if (unique)
						s[idx].setValue(initValue);
					return true;
				}
			}
		}

		s[idx].setValue(initValue);
		return false;
	}

	this.solve = function() {
		this.numSolutions_ = 0;
		return this.solve_(this.getSpaces_(), 0, false);
	}
	
	this.isUnique = function() {
		this.numSolutions_ = 0;
		this.solve_(this.getSpaces_(), 0, true);
		return this.numSolutions_ == 1;
	}
	
	this.clear = function(){
		for(var y = 0; y < 9; ++y){
			for( var x = 0; x < 9; ++x){
				this.spaces[y][x].clear();
			}
		}
	}
	// Recursive component of solve()
	this.solve_ = function(s, idx, unique) {
		if (idx >= s.length) {
			if (board.valid()) {
				++this.numSolutions_;
				return true;
			}
			return false;
		}

		if (s[idx].getValue() != 0)
			return this.solve_(s, idx + 1, unique);

		var initValue = s[idx].getValue()

		for (var i = 1; i < 10; ++i) {
			s[idx].setValue(i);
			if (s[idx].valid() && this.solve_(s, idx + 1, unique)) { 
				if (!unique || this.numSolutions_ >= 2) {
					if (unique)
						s[idx].setValue(initValue);
					return true;
				}
			}
		}

		s[idx].setValue(initValue);
		return false;
	}

	this.solve = function() {
		this.numSolutions_ = 0;
		return this.solve_(this.getSpaces_(), 0, false);
	}
	
	this.makeBoard_ = function(s, idx) {
		if (idx >= s.length){
			return board.valid();
		}

		var values = shuffle([1,2,3,4,5,6,7,8,9]);
		for (var i = 0; i < 9; ++i) {
			alert("sending: " + values[i]);
			s[idx].setValue(values[i]);
			if (s[idx].valid()) {
				if (this.makeBoard_(s, idx + 1)){
					return true;
				}
			}
		}
		s[idx].setValue(0);
		return false;
	}

	this.makeBoard = function() {
		// this.clear();
		// First, generate a randomized completed board
		var s = this.getSpaces_();
		
		this.makeBoard_(s, 0);
		
		shuffle(s);
		for (var i = 0, n = 0; n < 40 && i < s.length; ++i) {
			alert("getting: " + s[i].getValue())
			var v = s[i].getValue();
			s[i].setValue(0);
			if (this.isUnique()){
				++n;
			} else {
				s[i].setValue(v);
			}
		}

		// "fix" all the non-blanked spaces
		for (var i = 0; i < s.length; ++i) {
			if(s[i].getValue() != 0){
				s[i].fix();
			}
		}	
	}
}// End Board


var renderGame = function(){
	board = new Board();
	board.makeBoard();
	var boardDiv = document.getElementById('boardWrapper');
	boardDiv.innerHTML = initBoard(boardDiv);
}

var initBoard = function(gameBoard){
	var html = "<table id='board'>";
	
	for(var y = 0; y < 9; ++y){
		html += "<tr>";
		for(var x = 0; x < 9; ++x){
			html += "<td>" + board.spaces[y][x].toChar() + "</td>";
		}
		html += "</tr>";
	}
	html += '</table>'
	
	return html;
}//End initBoard()
