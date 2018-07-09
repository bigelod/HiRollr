s.boot;

(
SynthDef(\a, {
	arg freq=440, amp=0.1, out=0, sustain=1, wd = 0.5;
	var audio,env;

	audio = SinOsc.ar(freq:freq, mul:amp) * Pulse.ar(freq:[freq*2, freq, freq/2], mul:1, width:wd);

	audio = Mix.ar(audio);

	env = Env.perc(sustain/20, sustain);

	audio = audio * EnvGen.ar(env, doneAction:2);

	audio = Compander.ar(audio, audio, thresh:-6.dbamp, slopeAbove:1/20);

	Out.ar(out, audio);
}).add;
)

(instrument:\a, midinote:[94, 94, 99], strum:0.1, out:[0,1], wd:[0.5, 0.25, 0.75].choose).play