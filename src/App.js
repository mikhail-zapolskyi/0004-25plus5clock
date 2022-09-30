import { useEffect, useState, useRef }  from 'react';
import { BiDownArrow, BiUpArrow, BiRightArrow, BiPause, BiReset } from 'react-icons/bi';
import './App.css';

const App = () => {
     const [clock, setClock] = useState({ 
          breakTime: 5, 
          sessionTime: 25,
          timerType: 'Session',
          timerState: 'Stopped', // true: running - false: stop
          counter: 1500
     });
     
     const minutes = Math.floor(clock.counter / 60).toString().padStart(2, '0');
     const seconds = Math.floor(clock.counter - minutes * 60).toString().padStart(2, '0');
     const alertSound = useRef();
     
     useEffect(() => {
          setClock({ ...clock, counter: clock.sessionTime * 60})
          // eslint-disable-next-line
     }, [clock.sessionTime]);

     useEffect(() => {
          console.log(clock.counter);
          if(minutes === '00' && seconds === '00') {
               if(clock.timerType === 'Session') {
                    alertSound.current.play()
                    setTimeout(() => {
                         setClock({
                              ...clock,
                              counter: clock.breakTime * 60,
                              timerType: 'Break',
                              timerState: 'Running',
                         })
                         return;
                    }, 1000);
               } else if(clock.timerType === 'Break') {
                    alertSound.current.play()
                    setTimeout(() => {
                         setClock({
                              ...clock,
                              counter: clock.sessionTime * 60,
                              timerType: 'Session',
                              timerState: 'Running',
                         })
                         return;
                    }, 1000)
               }
          }
     // eslint-disable-next-line
     }, [clock.timerState, clock.counter, clock.timerState]);

     useEffect(() => {
          if (clock.timerState === 'Stopped') return;

          const runTimer = clock.counter > 0 && setInterval(() => {
               setClock({ ...clock, counter: clock.counter - 1 })
          }, 1000);

          return () => clearInterval(runTimer);
     })

     
     const controlClock = (e) => {
          const { id } = e.target;

          if(clock.timerState === 'Running') {
               return false
          };

          switch(id){
               case 'break-decrement':
                    if(clock.breakTime <= 1){
                         break;
                    };
                    setClock({ ...clock, breakTime: clock.breakTime - 1 })
                    break;
               case 'break-increment':
                    if(clock.breakTime >= 60){
                         break;
                    }
                    setClock({ ...clock, breakTime: clock.breakTime + 1 })
                    break;
               case 'session-decrement':
                    if(clock.sessionTime <= 1){
                         break;
                    }
                    setClock({ ...clock, sessionTime: clock.sessionTime - 1 })
                    break;
               case 'session-increment':
                    if(clock.sessionTime >= 60){
                         break;
                    }
                    setClock({ ...clock, sessionTime: clock.sessionTime + 1 })
                    break;
               default:
                    setClock(clock);
          }
     };

     const controlTimerState = () => {
          if(clock.timerState === 'Running') {
               setClock({ ...clock, timerState: 'Stopped'})
          }

          if(clock.timerState === 'Stopped') {
               setClock({ ...clock, timerState: 'Running'})
          }
     };
     
     const reset = () => {
          alertSound.current.pause();
          alertSound.current.currentTime = 0;
          setClock({
               breakTime: 5, 
               sessionTime: 25,
               timerType: 'Session', 
               timerState: 'Stopped',
               counter: 1500 
          });
     };
     
     return (
          <div className='wrapper'>
               <div className='clock'>
                    <div className='clock-title'>
                         <h1>25 + 5 Clock</h1>
                    </div>
                    <div className='clock-control'>
                         <div className='clock-labels'>
                              <p id='break-label'>Break Length</p>
                              <p id='session-label'>Session Length</p>
                         </div>
                         <div className='clock-buttons'>
                              <div className='clock-length'>
                                   <button id='break-decrement' onClick={controlClock}><BiDownArrow /></button>
                                   <p id='break-length'>{ clock.breakTime }</p>
                                   <button id='break-increment' onClick={controlClock}><BiUpArrow /></button>
                              </div>
                              <div className='clock-length'>
                                   <button id='session-decrement' onClick={controlClock}><BiDownArrow /></button>
                                   <p id='session-length'>{ clock.sessionTime }</p>
                                   <button id='session-increment' onClick={controlClock}><BiUpArrow /></button>
                              </div>
                         </div>
                    </div>
                    <div className='clock-counter'>
                         <div className='clock-timer'>
                              <p id='timer-label'>{ clock.timerType }</p>
                              <p id='time-left' style={{ color: minutes < 1 && 'red' }} >{ `${minutes}:${seconds}`}</p>
                         </div>
                         <div className='clock-timer--controls'>
                              <button id='start_stop' onClick={controlTimerState}>{ clock.timerState === 'Stopped' ? <BiRightArrow /> : <BiPause />}</button>
                              <button id='reset' onClick={reset}><BiReset /></button>
                         </div>
                    </div>
               </div>
               <audio
                    id="beep"
                    // preload="auto"
                    ref={alertSound}
                    src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
               />
          </div>
     )
};

export default App;