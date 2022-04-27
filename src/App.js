import './App.css';

import { BigPlayButton, ControlBar, ForwardControl, PlaybackRateMenuButton, Player, ReplayControl } from 'video-react';
import "../node_modules/video-react/dist/video-react.css";
import React, { useRef, useState } from 'react';
import Switch from './Nswitch';

function App() {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [layer, setLayer] = useState("audio");

  //Audio Layer
  const [childFunctionalSpeech, setChildFunctionalSpeech] = useState("");
  const [childNonFunctionalSpeech, setChildNonFunctionalSpeech] = useState(false);
  const [adultSpeaks, setAdultSpeaks] = useState(false);
  const [otherSpeaks, setOtherSpeaks] = useState(false);
  const [wrongCaptions, setWrongCaptions] = useState(false);

  //Video Layer
  const [handInteraction, setHandInteraction] = useState(false);
  const [childLookingAtAdultHands, setChildLookingAtAdultHands] = useState(false);
  const [childLookingAtAdultFace, setChildLookingAtAdultFace] = useState(false);
  const [childLookingAtObjectInAdultHands, setChildLookingAtObjectInAdultHands] = useState(false);
  const [childAdultNotInFrame, setChildAdultNotInFrame] = useState(false);
  const [childLeftAdultRight, setChildLeftAdultRight] = useState(false);
  const [childRightAdultLeft, setChildRightAdultLeft] = useState(false);

  //Clinical Layer
  const [attention, setAttention] = useState(false);
  const [reinforcement, setReinforcement] = useState(false);
  const [clearInstruction, setClearInstruction] = useState(false);
  const [followYourChildLead, setFollowYourChildLead] = useState(false);

  const [res, setRes] = useState([]);

  function resetStates() {
    setChildFunctionalSpeech("")
    setChildNonFunctionalSpeech(false)
    setAdultSpeaks(false)
    setOtherSpeaks(false)
    setWrongCaptions(false)

    setHandInteraction(false)
    setChildLookingAtAdultHands(false)
    setChildLookingAtAdultFace(false)
    setChildLookingAtObjectInAdultHands(false)
    setChildAdultNotInFrame(false)
    setChildLeftAdultRight(false)
    setChildRightAdultLeft(false)

    setAttention(false)
    setReinforcement(false)
    setClearInstruction(false)
    setFollowYourChildLead(false)
  }

  function saveEntry() {
    const { player } = playerRef.current.getState();
    var entry = {
      id: res.length,
      time: player.currentTime,
      audio: {},
      video: {},
      clinical: {}
    }

    if (childFunctionalSpeech !== "") entry.audio.childFunctionalSpeech = childFunctionalSpeech
    if (childNonFunctionalSpeech) entry.audio.childNonFunctionalSpeech = true
    if (adultSpeaks) entry.audio.adultSpeaks = adultSpeaks
    if (otherSpeaks) entry.audio.otherSpeaks = otherSpeaks
    if (wrongCaptions) entry.audio.wrongCaptions = wrongCaptions

    if (handInteraction) entry.video.handInteraction = handInteraction
    if (childLookingAtAdultHands) entry.video.childLooksAt = "Adult hands"
    if (childLookingAtAdultFace) entry.video.childLooksAt = "Adult face"
    if (childLookingAtObjectInAdultHands) entry.video.childLooksAt = "Object in adult hands"
    if (childAdultNotInFrame) entry.video.frameLocation = "Child or adult not in frame"
    if (childLeftAdultRight) entry.video.frameLocation = "Child left, adult right"
    if (childRightAdultLeft) entry.video.frameLocation = "Child right, adult left"

    if (attention) entry.clinical.attention = attention
    if (reinforcement) entry.clinical.reinforcement = reinforcement
    if (clearInstruction) entry.clinical.clearInstruction = clearInstruction
    if (followYourChildLead) entry.clinical.followYourChildLead = followYourChildLead

    if (Object.keys(entry.audio).length > 0 || Object.keys(entry.video).length > 0 || Object.keys(entry.clinical).length > 0) {
      setRes([...res, entry])
      resetStates()
    }
  }

  function saveJson() {
    const element = document.createElement("a");
    const textFile = new Blob([JSON.stringify(res)], { type: 'text/plain' });
    element.href = URL.createObjectURL(textFile);
    element.download = "userFile.json";
    document.body.appendChild(element);
    element.click();
  }

  function changeSource(e) {
    const fileReader = new FileReader();

    fileReader.onloadstart = () => {
      setVideoSrc(null);
    };
    fileReader.onloadend = () => {
      setVideoSrc(fileReader.result);
    };
    if (e.target.files[0]) {
      fileReader.readAsDataURL(e.target.files[0]);
    }
  }

  return (
    <div className="App">
      <div>

        <label class="nogrid">
          <span>Click To Upload Video</span>
          <input type="file" accept="video/*" onChange={changeSource} id="uploadFile" style={{ display: "none" }} />
        </label>
      </div>

      {
        videoSrc !== null &&
        <React.Fragment>
          <div>
            <button onClick={saveJson}>Save JSON</button>
          </div>
          <header className="App-header">
            <Player
              ref={playerRef}
              playsInline
              poster="/assets/poster.png"
              src={videoSrc}

              onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)}
            >
              <BigPlayButton position="center" />
              <ControlBar>
                <ReplayControl seconds={10} order={1.1} />
                <ForwardControl seconds={10} order={1.2} />
                <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
              </ControlBar>
            </Player>
          </header>

        </React.Fragment>
      }
      {
        !playing && videoSrc !== null &&
        <React.Fragment>
          <div>
            <hr />
            <select id="layer" value={layer} onChange={e => setLayer(e.target.value)}>
              <option value="audio">Audio Layer</option>
              <option value="video">Video Layer</option>
              <option value="clinical">Clinical Layer</option>
            </select>
          </div>
          <div>
            {layer === "audio" &&
              <React.Fragment>
                <div>
                  <label>
                    <span>Child Functional Speech</span>
                    <input
                      onChange={e => setChildFunctionalSpeech(e.target.value)}
                      value={childFunctionalSpeech}
                      placeholder="Enter transcriptions"
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Child non-functional speech</span>
                    <Switch
                      onChange={setChildNonFunctionalSpeech}
                      checked={childNonFunctionalSpeech}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Adult Speaks</span>
                    <Switch
                      onChange={setAdultSpeaks}
                      checked={adultSpeaks}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Other Speaks</span>
                    <Switch
                      onChange={setOtherSpeaks}
                      checked={otherSpeaks}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Wrong Captions</span>
                    <Switch
                      onChange={setWrongCaptions}
                      checked={wrongCaptions}
                    />
                  </label>
                </div>
              </React.Fragment>
            }
            {
              layer === "video" &&
              <React.Fragment>
                <div>
                  <label>
                    <span>Hand Interaction</span>
                    <Switch
                      onChange={setHandInteraction}
                      checked={handInteraction}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Child is looking at adult hands</span>
                    <Switch
                      onChange={setChildLookingAtAdultHands}
                      checked={childLookingAtAdultHands}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Child is looking at adult face</span>
                    <Switch
                      onChange={setChildLookingAtAdultFace}
                      checked={childLookingAtAdultFace}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Child is looking at object in adult hands</span>
                    <Switch
                      onChange={setChildLookingAtObjectInAdultHands}
                      checked={childLookingAtObjectInAdultHands}
                    />
                  </label>
                </div>
                <hr style={{ borderColor: "gray" }} />
                <div>
                  <label>
                    <span>Child/Adult not in frame</span>
                    <Switch
                      onChange={() => {
                        setChildAdultNotInFrame(true)
                        setChildLeftAdultRight(false)
                        setChildRightAdultLeft(false)
                      }}
                      checked={childAdultNotInFrame}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Child left adult right</span>
                    <Switch
                      onChange={() => {
                        setChildAdultNotInFrame(false)
                        setChildLeftAdultRight(true)
                        setChildRightAdultLeft(false)
                      }}
                      checked={childLeftAdultRight}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Child right adult left</span>
                    <Switch
                      onChange={() => {
                        setChildAdultNotInFrame(false)
                        setChildLeftAdultRight(false)
                        setChildRightAdultLeft(true)
                      }}
                      checked={childRightAdultLeft}
                    />
                  </label>
                </div>
              </React.Fragment>
            }
            {
              layer === "clinical" &&
              <React.Fragment>
                <div>
                  <label>
                    <span>Attention</span>
                    <Switch
                      onChange={setAttention}
                      checked={attention}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Reinforcement</span>
                    <Switch
                      onChange={setReinforcement}
                      checked={reinforcement}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Clear Instruction</span>
                    <Switch
                      onChange={setClearInstruction}
                      checked={clearInstruction}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <span>Follow your child lead</span>
                    <Switch
                      onChange={setFollowYourChildLead}
                      checked={followYourChildLead}
                    />
                  </label>
                </div>
              </React.Fragment>
            }
          </div>
          <div>
            <button onClick={saveEntry}>Save Entry</button>
          </div>
        </React.Fragment>
      }
    </div>
  );
}

export default App;
