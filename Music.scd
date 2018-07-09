s.boot;

(
SynthDef(\a, {
	arg freq=440, amp=0.1, out=0, sustain = 2;
	var audio, env;

	audio = Pulse.ar(freq:freq + (freq * SinOsc.ar(freq)), mul:amp);

	audio = audio + (Saw.ar(freq:freq, mul:amp) * SinOsc.ar(16));

	audio = audio + (WhiteNoise.ar(mul:amp * -24.dbamp) * SinOsc.ar(8));

	audio = audio + LFTri.ar(freq:[freq, freq / 2], mul:amp * -6.dbamp);

	audio = Mix.ar(audio);

	env = Env.perc(sustain/20, sustain);

	audio = audio * EnvGen.ar(env, doneAction:2);

	audio = Compander.ar(audio, audio, thresh:-6.dbamp, slopeAbove:1/20);

	Out.ar(out, audio);

}).add;
)

TempoClock.tempo = 2;

(
Pdef(\a, Pbind(
	\instrument, \a,
	\midinote, Pseq([[40, 64], [48, 68], 70, 90, [60, 90]], inf) + Pstutter(7, Prand([0, 2, 4, 7, 10], inf)),
	\db, -120,
	\dur, Prand([1/4, 1/2], inf),
	\sustain, 1/4,
	\out, Prand([0, 1, [0,1], [0,1]], inf)
));
)

Pdef(\a).fadeTime = 30;

Pdef(\a).play;
Pdef(\a).stop;