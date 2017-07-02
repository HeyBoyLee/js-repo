/**
 * Created by heyboy on 2017/7/2.
 */
setTimeout(function timeout() {
    console.log('TIMEOUT FIRED');
}, 0);
// 无其他代码时输出结果不定
// 因为setTimeout时 0自动+1，此脚本跑完不需要1ms，这时会输出1，TIMEOUT FIRED, 2
// 由于CPU 时间片的原因没有在1ms内跑完此脚本时，会输出TIMEOUT FIRED, 1, 2
setImmediate(function A() {
    console.log(1);
    setImmediate(function B(){console.log(2);});
});


