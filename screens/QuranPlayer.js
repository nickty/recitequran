import React, {useEffect, useRef, useState} from 'react';
import TrackPlayer, {
  State,
  usePlaybackState,
  Capability,
  useProgress,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import songs from '../model/Data';

const {width, height} = Dimensions.get('window');

const togglePlayBack = async playBackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack != null) {
    // console.log('are you here?', State);
    await TrackPlayer.play();
    if (playBackState == State.Paused) {
      // console.log('from n');
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

const QuranPlayer = () => {
  const playBackState = usePlaybackState();
  const [suraInext, setSuraIndex] = useState(0);
  const scrollx = useRef(new Animated.Value(0)).current;

  const progress = useProgress();

  // changing the track check repo
  const [title, setTitle] = useState();
  const [artist, setArtist] = useState();
  const [artwork, setArtwork] = useState();
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artist, artwork} = track;
      setTitle(title);
      setArtist(artist);
      setArtwork(artwork);
    }
  });

  useEffect(() => {
    // TrackPlayer.updateOptions({
    //   stopWithApp: false,
    //   capabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
    //   compactCapabilities: [
    //     TrackPlayer.CAPABILITY_PLAY,
    //     TrackPlayer.CAPABILITY_PAUSE,
    //   ],
    // });
    setUpPlayer();
    scrollx.addListener(({value}) => {
      // console.log(value);
      const index = Math.round(value / width);
      console.log(index);
      skipTo(index);
      setSuraIndex(index);
    });

    // return () => TrackPlayer.destroy();
  }, []);

  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
  };

  const setUpPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add(songs);
      console.log('truck added');
    } catch (error) {
      console.log(error);
    }
  };

  const suraSlider = useRef(null);

  const skipToNext = () => {
    suraSlider.current.scrollToOffset({
      offset: (suraInext + 1) * width,
    });
  };
  const skipToPrev = () => {
    suraSlider.current.scrollToOffset({
      offset: (suraInext - 1) * width,
    });
  };

  const renderSuras = ({item, index}) => {
    return (
      <Animated.View style={styles.mainImageWrapper}>
        <View style={styles.imageWrapper}>
          <Image source={artwork} style={styles.musicImage} />
        </View>
      </Animated.View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <Animated.FlatList
          ref={suraSlider}
          renderItem={renderSuras}
          data={songs}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          //   showsHorizontalScrollIndicator = "false"
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollx,
                  },
                },
              },
            ],
            {useNativeDriver: true},
          )}
        />

        <View style={styles.suraContent}>
          <Text style={styles.suraTitle}>{title}</Text>
          <Text style={styles.suraArtist}>{artist}</Text>
        </View>
        <View>
          <Slider
            style={styles.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            minimumTrackTintColor="#FFFFFF"
            thumbTintColor="#ffd369"
            maximumTrackTintColor="#fff"
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }}
          />
          {/* progress duration */}
          <View style={styles.progressDuration}>
            <Text style={styles.progressLavelText}>
              {new Date(progress.position * 1000)
                .toLocaleTimeString()
                .substring(3)}
            </Text>
            <Text style={styles.progressLavelText}>
              {new Date(progress.duration - progress.position * 1000)
                .toLocaleTimeString()
                .substring(3)}
            </Text>
          </View>
        </View>

        <View style={styles.musicControl}>
          <TouchableOpacity onPress={skipToPrev}>
            <Ionicons name="play-skip-back-outline" size={35} color="#ffd369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayBack(playBackState)}>
            <Ionicons
              name={
                playBackState === State.Playing
                  ? 'ios-pause-circle'
                  : 'ios-play-circle'
              }
              size={75}
              color="#888888"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext}>
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              color="#ffd369"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomWrapper}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="heart-outline" size={30} color="#888888" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="repeat" size={30} color="#888888" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="share-outline" size={30} color="#888888" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal" size={30} color="#888888" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QuranPlayer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
    borderTopColor: '#393E46',
    borderWidth: 1,
  },
  bottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  imageWrapper: {
    width: 300,
    height: 340,
    marginBottom: 25,
    marginTop: 20,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  suraTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#eeeeee',
  },
  suraArtist: {
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    color: '#eeeeee',
  },
  progressBar: {
    width: 350,
    height: 40,
    marginTop: 45,
    flexDirection: 'row',
  },
  progressDuration: {
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLavelText: {
    color: '#fff',
    fontWeight: '500',
  },
  musicControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 15,
  },
  mainImageWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
