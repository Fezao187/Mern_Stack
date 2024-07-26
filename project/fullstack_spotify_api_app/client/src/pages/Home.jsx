import React, { useEffect, useState } from "react";
import { Container, Card, Row, Spinner } from "react-bootstrap";
import axios from "axios";

function Home() {
    const [albumsList, setAlbumsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const getDbAlbums = async () => {
            const data = await axios.get("http://localhost:5000/")
            setAlbumsList(data.data.data);
            setIsLoading(false);
        };
        getDbAlbums();
        console.log("UseEffect ran");
    }, []);
    return (
        <Container>
            <Row className="mx-2 row row-cols-5">
                {isLoading == true ? (<div className="loading"><div><Spinner animation="grow" /></div></div>) :
                    (
                        albumsList.map((album) => {
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
                                            <hr />
                                            <p>Posted by <strong>{album.username}</strong></p>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            )
                        })
                    )}
            </Row>
        </Container>
    )
}

export default Home;