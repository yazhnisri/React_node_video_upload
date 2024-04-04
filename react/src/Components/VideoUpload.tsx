import React, { useState, ChangeEvent, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { Button, CircularProgress, Container, FormControl, FormHelperText, Input, InputLabel, LinearProgress, Typography, Box } from '@mui/material';

const MAX_FILE_SIZE_MB = 100; // Maximum file size in megabytes
let apiURL = "http://localhost:3001/upload";

const VideoUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log(file,"filedatattatatat")
            setSelectedFile(file);
            setError(null);
            setShowPreview(true); // Show preview when file is selected
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        // Client-side validation for file size
        if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(`File size exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB`);
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('video', selectedFile);

        try {
            const response = await axios.post(`${apiURL}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent:any) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            });
            console.log('Upload successful:', response.data);
        } catch (error) {
            const axiosError:any = error as AxiosError;
            if (axiosError.response) {
                // The request was made and the server responded with a status code
                setError(axiosError.response.data.message || 'Upload failed');
            } else if (axiosError.request) {
                // The request was made but no response was received
                setError('No response received from the server. Please try again.');
            } else {
                // Something happened in setting up the request that triggered an Error
                setError('An error occurred. Please check your network connection and try again.');
            }
        } finally {
            setUploading(false);
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.removeAttribute('src');
                videoRef.current.load();
            }
        }
    };

    return (
        <Container>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f0f0',
            }}>
                <Box sx={{
                    width: '400px',
                    padding: '2rem',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}>
                        <InputLabel htmlFor="file-upload">Select Video File</InputLabel>

                    <FormControl fullWidth sx={{ marginBottom: '1rem' }}>
                        <Input
                            id="file-upload"
                            type="file"
                            inputProps={{ accept: "video/mp4, video/quicktime" }}
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                        <FormHelperText>Select a video file to upload</FormHelperText>
                    </FormControl>

                    {!uploading && showPreview && selectedFile && (
                        <div style={{ marginBottom: '1rem', height: '240px', overflow: 'hidden' }}>
                            <video
                                ref={videoRef}
                                src={URL.createObjectURL(selectedFile)}
                                controls
                                style={{ display: 'block', width: '100%', maxHeight: '200px', marginTop: '1rem' }}
                            />
                        </div>
                    )}

                    {error && <Typography variant="body1" style={{ color: 'red', marginTop: '1rem' }}>{error}</Typography>}

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '1rem' }}>
                        <Box sx={{ marginBottom: '1rem' }}>
                            <Button
                                variant="contained"
                                onClick={handleUpload}
                                disabled={!selectedFile || uploading}
                            >
                                {uploading ? 'Uploading...' : 'Upload Video'}
                            </Button>
                        </Box>

                        {uploading && <LinearProgress variant="determinate" value={uploadProgress} style={{ width: '100%', maxWidth: '400px' }} />}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default VideoUpload;
