import React, { useState } from "react";
import { Card, Button, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AlbumEdit() {
    const [imgURL, setImgURL] = useState("");
    const [albumName, setAlbumName] = useState("");
    const [artistName, setArtistName] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [totalTracks, setTotalTracks] = useState("");
    const [albumId, setAlbumId] = useState(sessionStorage.getItem("id"));
    const [token, setToken] = useState(sessionStorage.getItem("token"));
    let navigate = useNavigate();

    const editAlbum = async () => {
        const newFields = {
            albumName: albumName,
            imgUrl: imgURL,
            artistName: artistName,
            releaseDate: releaseDate,
            totalTracks: totalTracks
        };

        const editAlb = await axios.put(`https://mern-stack-2w7i.onrender.com/${albumId}`, newFields,{
            headers: {
                'authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        navigate("/favorites/page");
    }
    const cancelBtn = () => {
        navigate("/favorites/page");
    }
    return (
        <div className="center1">
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title><strong>Edit album</strong></Card.Title>
                        <hr />
                        <Card.Text>
                            <p><strong>Album Name</strong>: <input type="text" placeholder="Enter album name" onChange={(e) => setAlbumName(e.target.value)} required /></p>
                            <p><strong>Image URL</strong>: <input type="text" placeholder="Enter image URL" onChange={(e) => setImgURL(e.target.value)} required /></p>
                            <p><strong>Artist</strong>: <input type="text" placeholder="Enter artist name" onChange={(e) => setArtistName(e.target.value)} required /></p>
                            <p><strong>Release Date</strong>: <input type="text" placeholder="Album release date" onChange={(e) => setReleaseDate(e.target.value)} required /></p>
                            <p><strong>Total Tracks</strong>: <input type="number" placeholder="Enter total tracks" onChange={(e) => setTotalTracks(e.target.value)} required /></p>
                        </Card.Text>
                    </Card.Body>
                    <Button variant="success" onClick={editAlbum}>Save</Button>
                    <Button variant="danger" onClick={cancelBtn}>Cancel</Button>
                </Card>
            </Container>
        </div>
    )
}
export default AlbumEdit;