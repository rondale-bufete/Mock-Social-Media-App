import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Image, ScrollView, ActivityIndicator, FlatList, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import Loader from '../components/Loader';
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const HomeScreen = ({ navigation }) => {
    
    const [userDetails, setUserDetails] = useState();
    const [mindText, setMindText] = useState(''); 
    const [postedText, setPostedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [appUserName, setAppUserName] = useState('');
    const [appUser, setAppUser] = useState(null);
    const [userList, setUserList] = useState([]);
    const [dummyPosts, setDummyPosts] = useState([]);
    const [showClearButton, setShowClearButton] = useState(false);
    const [showSearchResult, setShowSearchResult] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [optionsVisible, setOptionsVisible] = useState(false);
    const fetchData = async () => {
        if (!appUserName) {
            setIsLoading(true);
            setShowSearchResult(false);
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`https://reqres.in/api/users?first_name=${appUserName}`);
            const json = await response.json();
            if (json.data && json.data.length > 0) {
                const searchedUser = json.data.find(user => user.first_name === appUserName.split(' ')[0]);
                if (searchedUser) {
                    setAppUser(searchedUser);
                    setShowSearchResult(true);
                } else {
                    setAppUser(null);
                    setShowSearchResult(false);
                }
            } else {
                setAppUser(null);
                setShowSearchResult(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setAppUserName('');
        setAppUser(null);
        setShowSearchResult(false);
    };

    const handleSearchInputChange = (text) => {
        setAppUserName(text);
        setShowClearButton(text.length > 0);
    };

    const handleClearSearch = () => {
        setAppUserName('');
        setAppUser(null);
        setShowSearchResult(false);
        setShowClearButton(false);
    };

    const getRandomText = () => {
        const texts = [
            "Just had the best meal ever! 🍔🍟 What's everyone else having for dinner?",
            "Feeling so grateful for all the amazing people in my life right now. 💕",
            "Can't wait for the weekend to begin! Any fun plans coming up?",
            "Just finished a great book. Any recommendations for my next read?",
            "Feeling a bit stressed today. Any tips for relaxation?",
            "Just started a new workout routine. Who else loves staying active?",
            "Watching Stranger Things! Anyone else obsessed with this series?",
            "Missing my bestie Franco today. Can't wait to see them soon!",
            "Feeling inspired after visiting the beach. Nature always brings me peace.",
            "Just reached a personal milestone! Celebrating small victories. 🎉",
            "Needing some motivation today. What keeps you going when times get tough?",
            "Trying out a new recipe tonight. Fingers crossed it turns out well!",
            "Reflecting on my birthday. Grateful for the lessons learned.",
            "Feeling nostalgic listening to 90s hits. What's your favorite throwback song?",
            "Excited to start a new project! Who else loves being creative?",
            "Thinking about future travel plans. Where's your dream vacation destination?",
            "Just finished a great workout. Feeling energized and ready to conquer the day!",
            "Enjoying a quiet night in with a good book and a cup of tea. Bliss. ☕📖",
            "Feeling thankful for the little things today. What's something that made you smile recently?",
            "Looking forward to the upcoming holidays. What's your favorite part of this time of year?",
        ];
        return texts[Math.floor(Math.random() * texts.length)];
    };

    const createDummyPosts = (users) => {
        const posts = users.map((user, index) => ({
            id: index,
            userName: `${user.first_name} ${user.last_name}`,
            avatar: user.avatar,
            content: getRandomText(),
        }));
        setDummyPosts(posts);
    };

    const getUserData = async () => {
        try {
            const userLoggedInData = await AsyncStorage.getItem('UserLoggedInData');
            if (userLoggedInData) {
                const parsedData = JSON.parse(userLoggedInData);
                setUserDetails(parsedData.user);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('UserLoggedInData');

            const isGoogleSignedIn = await GoogleSignin.isSignedIn();
            if (isGoogleSignedIn) {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
            }

            if (auth().currentUser) {
                await auth().signOut();
            }

            setUserDetails(null);
            navigation.navigate("LoginScreen");
        } catch (error) {
            console.error("Something went wrong:", error);
        }
    };

    const handlePost = () => {
        setIsLoading(true);
        setTimeout(() => {

            try {
                setIsLoading(false);
                if (mindText.trim()) {
                    const postContent = ` ${mindText}`;
                    setPostedText(postContent);
                    setDummyPosts((prevPosts) => [...prevPosts, { 
                      id: Date.now(), 
                      userName: userDetails?.fullName || userDetails?.displayName || userDetails?.FullName, 
                      avatar: userDetails?.avatar || userDetails?.photoURL, 
                      content: postContent }]);

                        
                var user_name = userDetails?.fullName || userDetails?.displayName || userDetails?.FullName;
                var post_text = postContent;
                
                var API_URL = "http://10.0.2.2:80/api/post_insert.php";
                
                var headers = {
                    'Accept':'application/json',
                    'Content':'application/json',
                };
                var Data = {
                    user_name:user_name,
                    post_text:post_text,

                };
                fetch(API_URL, {
                    method:'POST',
                    headers:headers,
                    body: JSON.stringify(Data),
                })
                .then((response)=>response.json())
                .then((response)=>{
                    console.log("POSTED");
                })
                .catch((error)=>{
                    alert("Error"+error);
                })



                    setMindText('');
                }
            } catch (error) {
                console.error(error);
            }
        }, 1000);
    };

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        const fetchDataAndSetRandomUserId = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`https://reqres.in/api/users?page=2`);
                const json = await response.json();
                const randomUserId = Math.floor(Math.random() * json.data.length);
                setUserList(json.data);
                createDummyPosts(json.data);
                setSelectedUserId(json.data[randomUserId].id);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDataAndSetRandomUserId();
    }, []);

    const toggleOptions = () => {
        setOptionsVisible(!optionsVisible);
    };
    const navigateToProfile = () => {
        navigation.navigate('UserProfile', { userDetails: userDetails });
    };
    const navigateToUserProfile = (user) => {
        navigation.navigate('UserProfile', { userDetails: userDetails, selectedUser: user });
    };


    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:80/api/get_post.php');
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (postId) => {
    try {
        const API_URL = 'http://10.0.2.2:80/api/delete_post.php';
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: postId,
            }),
        });

        if (response.ok) {
            console.log('Post deleted successfully');
        } else {
            console.error('Failed to delete post');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
    }
};

const handleDeletePost = (postId) => {
    deletePost(postId);
};

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={isLoading} />
      <View style={styles.header}>
        <View style={styles.userHead}>
          {userDetails?.photoURL ? (
            <Image onPress={navigateToProfile} style={styles.avatarSmall} source={{ uri: userDetails?.photoURL }} />
          ) : (
            <View onPress={navigateToProfile} style={styles.userIcon} ><Icon name="user" size={20}/></View>
              
          )}
          <Text style={styles.welcomeMSG} onPress={navigateToProfile}>Welcome, {userDetails?.displayName || userDetails?.fullName || userDetails?.FullName}</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.7}>
            <Text style={styles.lgtTxt}>Logout</Text>
          </TouchableOpacity>
        </View>
        
      </View>
      
      <View style={styles.searchBar}>
        <TextInput 
          placeholder='Search by name' 
          style={styles.searchInput} 
          onChangeText={handleSearchInputChange}
          value={appUserName}
        />
        {showClearButton && (
          <TouchableOpacity 
            style={styles.clearBtn}
            onPress={handleClearSearch}
          >
          <Icon name='times' style={styles.rmvIcon} />
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.searchBtn}
          onPress={fetchData}
          disabled={isLoading || !appUserName}
        >
          <Icon name='search' style={{ color: 'darkblue', fontWeight: 'bold', fontSize: 20 }} />
          <Text style={{ color: 'darkblue', fontWeight: 'bold' }}>Search</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
          <Loader visible={isLoading} />
        ) : null}

      {showSearchResult ? (
          <View style={styles.postBody}>
            <View style={styles.searched}>
              <Text>Search result:</Text>
              <View style={styles.containSearch}>
                <Image source={{ uri: appUser.avatar }} style={styles.avatar} />
                <View style={styles.textContainer}>
                  <Text style={styles.searchedResult}>{`${appUser.first_name} ${appUser.last_name}`}</Text>
                  <Text style={styles.email}>{appUser.email}</Text>
                </View>
              </View>
            </View>
          </View>
        ) :<View style={styles.postBody}>
                <ScrollView style={{ width: '100%' }}>
                    <View style={styles.onYourMindBar}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'darkblue', marginVertical: 10 }}>What's on your mind?</Text>
                        <TextInput
                            multiline={true}
                            numberOfLines={10}
                            style={styles.inputStatus}
                            value={mindText}
                            onChangeText={setMindText}
                            placeholder='Write something...'
                        />
                        <TouchableOpacity style={styles.postBtn} onPress={handlePost}>
                            <Text style={{ color: 'darkblue', fontWeight: 'bold', fontSize: 15 }}>Post</Text>
                        </TouchableOpacity>
                    </View>

                    {postedText ? (
                        <View style={styles.onYourMindPoster}>
                            <View style={styles.headerName1}>
                                <View style={styles.head1}>
                                   {userDetails?.photoURL ? (
                                        <Image style={styles.avatarSmall} source={{ uri: userDetails?.photoURL }} />
                                    ) : (
                                        <View style={styles.userIcon} ><Icon name="user" size={20}/></View>
                                        
                                    )}
                                        <Text style={styles.userName}>{userDetails?.fullName || userDetails?.displayName || userDetails?.FullName}</Text> 
                                </View>
                                <View><TouchableOpacity style={styles.optionsBtn} onPress={toggleOptions}>
                                    <Icon name="ellipsis-h" size={20} color="darkblue" />
                                </TouchableOpacity></View>
                                
                            </View>
                            <Text style={styles.postedText}>{postedText}</Text>
                            <View style={styles.actionRow}>
                                <View style={styles.actionButton}>
                                    <Icon name="thumbs-up" size={20} color="darkblue" />
                                </View>
                                <View style={styles.actionButton}>
                                    <Icon name="comment" size={20} color="darkblue" />
                                </View>
                                <View style={styles.actionButton}>
                                    <Icon name="share" size={20} color="darkblue" />
                                </View>
                            </View>
                            {optionsVisible && (
                                <View style={styles.optionsMenu}>
                                    <TouchableOpacity onPress={handleDeletePost} >
                                        <Text style={styles.optionText}>Delete</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Text style={styles.optionText}>Edit</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ) : null}

                    <View style={styles.listHeadContain}>
                        <Text style={styles.listHead}>Suggested for you:</Text>
                        <FlatList
                            style={styles.FlatList}
                            contentContainerStyle={styles.listContentContainer}
                            data={userList}
                            horizontal={true}
                            keyExtractor={(item) => item.id === selectedUserId ? `${item.id}-selected` : `${item.id}`}
                            renderItem={({ item }) => (
                                <View onPress={() => navigateToUserProfile(item)} style={styles.listItem}>
                                    {item.id === selectedUserId ? (
                                        <View style={styles.selectedBorder} />
                                    ) : null}
                                    <Image onPress={() => navigateToUserProfile(item)} source={{ uri: item.avatar }} style={styles.avatar} />
                                    <Text onPress={() => navigateToUserProfile(item)} style={styles.userName}>{`${item.first_name} ${item.last_name}`}</Text>
                                    <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
                                        <Text style={styles.addButtonText}>Add Friend</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                    
                    <View style={styles.dummyPostsContainer}>
                        {dummyPosts.map((post) => (
                            <View key={post.id} style={styles.onYourMindPoster}>
                                <View style={styles.headerName}>
                                    <Image source={{ uri: post.avatar }} style={styles.avatarSmall} />
                                    <Text style={styles.userName}>{post.userName}</Text>
                                </View>
                                <Text style={styles.postedText}>{post.content}</Text>
                                <View style={styles.actionRow}>
                                    <View style={styles.actionButton}>
                                        <Icon name="thumbs-up" size={20} color="darkblue" />
                                    </View>
                                    <View style={styles.actionButton}>
                                        <Icon name="comment" size={20} color="darkblue" />
                                    </View>
                                    <View style={styles.actionButton}>
                                        <Icon name="share" size={20} color="darkblue" />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={styles.fetchedPostsContainer}>
                        {posts && posts.length > 0 ? (
                            posts.map((post) => (
                                <View key={post.id} style={styles.postContainer}>
                                    <Text style={styles.postedText}>{post.post_text}</Text>
                                    <Text style={styles.userName}>Posted by: {post.user_name}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.endTxt}>No posts available</Text>
                        )}
                    </View>
                    
                                    
                    <View style={styles.marginCont}></View>
                </ScrollView>
            </View>
        }
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
        // backgroundColor: 'lightcyan',
        flex: 1,
        
        alignItems: 'center',
    },
    welcomeMSG: {
        textAlign: 'center',
        fontSize: 15,
        flexDirection: 'row',
        color: 'darkblue',
        fontWeight: 'bold',
    },
    header: {
        marginTop: '5%',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'darkblue',
        width: '100%',
    },
    userHead: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    userIcon: {
      width: 30,
      height: 30,
      borderWidth: 0.5,
      borderRadius: 15,
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    logoutBtn: {
      backgroundColor: '#d90429',
      paddingVertical: 4,
      paddingHorizontal: 15,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: 'darkblue'
    },
    lgtTxt: {
      color: 'white'
    },
    searchBar: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 25,
    },
    searched: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '90%',
        borderRadius: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'darkblue',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        backgroundColor: 'lightcyan',
    },
    containSearch: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    textContainer: {
        flexDirection: 'column',
        marginLeft: 35,
    },
    searchedResult: {
        fontSize: 16,
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#555',
    },
    searchInput: {
        width: '60%',
        color: 'darkblue',
        fontSize: 13,
        height: 'auto',
        padding: 5,
        paddingLeft: 10,
        borderWidth: 1,
        borderColor: 'darkblue',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        backgroundColor: 'lightcyan',
    },
    searchBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderWidth: 1,
        borderColor: 'darkblue',
        paddingHorizontal: 13,
        height: '100%',
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        backgroundColor: 'lightcyan',
    },
    rmvIcon: {
        color: 'darkblue', 
        fontWeight: 'bold', 
        fontSize: 20,
    },
    postBody: {
        width: '100%',
        height: 'auto',
        alignItems: 'center'
        
    },
    onYourMindBar: {
        height: 'auto',
        alignSelf: 'center',
        width: '95%',
        marginBottom: '15%',
       
    },
    inputStatus: {
        borderWidth: 1,
        borderColor: 'darkblue',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        color: 'darkblue',
        backgroundColor: 'lightcyan',
        paddingHorizontal: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    postBtn: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'darkblue',
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightcyan',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    onYourMindPoster: {
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: 'lightcyan',
        borderColor: 'darkblue',
        borderWidth: 0.5,
        shadowOffset: {
        width: 20,
        height: 20,
        },
        shadowOpacity: 0.9,
        shadowRadius: 54,
        elevation: 20,
        padding: 20,
        margin: 10,
    },
    avatarSmall: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    headerName: {
        marginBottom: 10,
        display: 'flex',
        
        alignItems: 'center',
        flexDirection: 'row',
    },
    headerName1: {
        marginBottom: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    head1: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 25,
        
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    actionText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#333',
    },
    postedText: {
        color: 'black',
        fontSize: 15,
        marginLeft: 10,
        fontWeight: 'bold',
        width: '90%',
        paddingVertical: 2,
        paddingBottom: 10,
    },
    placeholderText: {
        color: 'gray',
        fontSize: 15,
        fontStyle: 'italic',
    },
    listHeadContain: {
        marginTop: 15,
        marginVertical: 'auto',
        width: '100%',
        paddingVertical: 5,
        // backgroundColor: 'rgba(255, 255, 255, 0.3)',
        
    },
    listHead: {
        marginVertical: 2,
        marginLeft: 5,
    },
    FlatList: {
        marginBottom: 20, 
    },
    listContentContainer: {
        paddingHorizontal: 10, 
        shadowOffset: {
        width: 20,
        height: 20,
        },
        shadowOpacity: 0.9,
        shadowRadius: 54,
        elevation: 20,
        padding: 20,
        margin: 10,
    },
    listItem: {
        backgroundColor: 'lightcyan',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: 'darkblue',
        padding: 10,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        elevation: 3,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'darkblue',
    },
    addButton: {
        backgroundColor: 'darkblue',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 5, 
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    separator: {
        width: 10,
    },

    marginCont: {
        height: 250,
    },
    searched: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '90%',
        borderRadius: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'darkblue',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        backgroundColor: 'lightcyan',
    },
    containSearch: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    textContainer: {
        flexDirection: 'column',
        marginLeft: 35,
    },
    searchedResult: {
        fontSize: 16,
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#555',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 2,
        marginTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionsBtn: {
        padding: 10,
    },
    optionsMenu: {
        position: 'absolute',
        right: 10,
        top: 40,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5,
        zIndex: 10,
    },
    optionText: {
        padding: 10,
        fontSize: 16,
    },
    endTxt: {
        textAlign: 'center'
    }
});

export default HomeScreen;
