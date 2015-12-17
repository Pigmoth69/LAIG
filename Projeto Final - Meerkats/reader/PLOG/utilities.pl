
clearScreen :- write('\33\[2J').

getChar(Input) :- 	get_char(Input),
					get_char(_).

getInteger(Input) :-	get_code(Code),
						Input is Code - 48,
						get_char(_).

getEnter :- get_char(_).

startSeed:-
	now(Usec), Seed is Usec mod 30269,
	getrand(random(X, Y, Z, _)),
	setrand(random(Seed, X, Y, Z)), !.