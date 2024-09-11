import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, InputGroup, FormControl, Button, Card, Row, Spinner } from "react-bootstrap";
import "../App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Favorites({ isAuth }) {

    const cilentID = process.env.REACT_APP_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET;

    const [searchInput, setSearchInput] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [albums, setAlbums] = useState([]);
    const [albumsList, setAlbumsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [token, setToken] = useState(sessionStorage.getItem("token"));

    let navigate = useNavigate();

    useEffect(() => {
        let authParams = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=client_credentials&client_id=" + cilentID + "&client_secret=" + clientSecret
        }
        fetch("https://accounts.spotify.com/api/token", authParams)
            .then(result => result.json())
            .then(data => setAccessToken(data.access_token))
    }, [])

    const searchAlbums = async () => {
        let artistParams = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            }
        }
        let getArtistID = await fetch("https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist", artistParams)
            .then(res => res.json())
            .then(data => { return data.artists.items[0].id })
        let getAlbums = await fetch("https://api.spotify.com/v1/artists/" + getArtistID + "/albums" + "?include_groups=album&market=US&limit=50", artistParams)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setAlbums(data.items);
            }) || [];
    }
    const clearSearch = () => {
        window.location.reload();
    }
    useEffect(() => {
        const getDbAlbums = async () => {
            const data = await axios.get("https://mern-stack-2w7i.onrender.com/myAlbums", {
                headers: {
                    'authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            console.log(data.data.albums);
            setAlbumsList(data.data.albums);
            setIsLoading(false);
        };
        getDbAlbums();
        console.log("useEffect ran")
    }, []);
    const deleteDbAlbum = async (id) => {
        const deleteAlbum = await axios.delete(`https://mern-stack-2w7i.onrender.com/${id}`, {
            headers: {
                'authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        window.location.reload();
    }

    useEffect(() => {
        if (!isAuth) {
            navigate("/login/page");
        }
    });

    const handleEdit = (id) => {
        sessionStorage.setItem("id", id);
        navigate(`/edit/album/${id}`);
    }
    return (
        <>
            <div>
                <Container>
                    <InputGroup className="mb-3" size="lg">
                        <FormControl
                            placeholder="Search for artist"
                            type="input"
                            onKeyPress={event => {
                                if (event.key == "Enter") {
                                    searchAlbums();
                                }
                            }}
                            onChange={event => setSearchInput(event.target.value)}
                        />
                        <Button variant="outline-info" onClick={searchAlbums}>Search</Button>
                        <Button variant="outline-info" onClick={clearSearch}>Clear</Button>
                    </InputGroup>
                </Container>
                <Container>
                    <Row className="mx-2 row row-cols-1">
                        {console.log(albums)}
                        {albums.map((album, i) => {
                            const saveAlbums = async () => {
                                try {
                                    const albumObj = {
                                        albumName: album.name,
                                        imgUrl: album.images[0].url,
                                        artistName: album.artists[0].name,
                                        releaseDate: album.release_date,
                                        totalTracks: album.total_tracks
                                    }

                                    const { data } = await axios.post("https://mern-stack-2w7i.onrender.com/favorites",
                                        albumObj,
                                        {
                                            headers: {
                                                'authorization': `Bearer ${token}`,
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json'
                                            }
                                        }
                                    );
                                    const { status, message } = data;
                                    if (status) {
                                        console.log(data);
                                        setUsername("Fezao187");
                                        let albumName = JSON.stringify(album.name);
                                        alert("Successfully added " + albumName);
                                    } else {
                                        console.log(data);
                                        alert(message);
                                    }
                                } catch (error) {
                                    alert(error);
                                }
                            }
                            return (
                                <Card>
                                    <div className="alb-cont">
                                        <div className="img-size">
                                            <Card.Img fluid src={album.images[0].url} />
                                        </div>
                                        <div className="alb-bod">
                                            <div>
                                                <Card.Body>
                                                    <Card.Title>{album.name}</Card.Title>
                                                    <Card.Text>
                                                        <p><strong>Artist</strong>: {album.artists[0].name}</p>
                                                        <p><strong>Release Date</strong>: {album.release_date}</p>
                                                        <p><strong>Total Tracks</strong>: {album.total_tracks}</p>
                                                    </Card.Text>
                                                    <Button fluid variant="success" onClick={saveAlbums}>Add</Button>
                                                </Card.Body>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </Row>
                </Container>
                <Container>
                    <Row className="mx-2 row row-cols-5">
                        {isLoading == true ? (<div className="loading"><div><Spinner animation="grow" /></div></div>) :
                            (
                                albumsList.map((album) => {
                                    if (album) {
                                        return (
                                            <Card>
                                                <div className="img-size">
                                                    <Card.Img fluid src={album.imgUrl} />
                                                </div>
                                                <Card.Body>
                                                    <Card.Title>{album.albumName}</Card.Title>
                                                    <Card.Text>
                                                        <p><strong>Artist</strong>: {album.artistName}</p>
                                                        <p><strong>Release Date</strong>: {album.releaseDate}</p>
                                                        <p><strong>Total Tracks</strong>: {album.totalTracks}</p>
                                                    </Card.Text>
                                                </Card.Body>
                                                <Button variant="warning" onClick={e => handleEdit(album._id)}>Edit</Button>
                                                <Button variant="danger" onClick={event => deleteDbAlbum(album._id)}>Remove</Button>
                                            </Card>
                                        )
                                    } else {
                                        <h1>Nothing to display</h1>
                                    }
                                })
                            )}
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Favorites;