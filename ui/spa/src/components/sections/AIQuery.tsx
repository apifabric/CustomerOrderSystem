import React, { useState } from 'react';
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Paper, Typography, Tabs, Tab, Box, List, ListItem, Backdrop, CircularProgress, Radio, RadioGroup, FormControlLabel, Grid, Link } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import Draggable from 'react-draggable';
import { useDataProvider } from 'react-admin';
import handleAIQuery from './AIQueryHandler';
import ComponentList from './ComponentList.tsx';
import { getAppId } from '../../util/util.tsx';
import './style/AIQuery.css'; // Import the CSS file

// Custom PaperComponent for draggable dialog functionality
const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const MainDialog = ({ isDialogOpen, toggleDialog, selectedTab, handleTabChange, aiPromptValue, handleChange, handleSubmit, loading, selectedOption, handleOptionChange, imagePrompt, handleImagePromptChange, handleImageUpload, imageNames, toggleImageDialog, refreshVersion, toggleSaveDialog }) => {
  const appName = sessionStorage.getItem('appName') || getAppId();
  const appId = (
    <Typography variant='caption' sx={{ color: "#ccc", verticalAlign: "left", width: "90%" }}>
      <IconButton onClick={() => {
        localStorage.removeItem('appId');
        document.location.reload();
      }} sx={{ color: "#ccc", padding: 0, marginRight: '8px' }}>
        <SettingsIcon />
      </IconButton>
    </Typography>
  );

  return (
    <Dialog
      open={isDialogOpen}
      onClose={toggleDialog}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle style={{ cursor: 'move', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} id="draggable-dialog-title">
        <span style={{ flexGrow: 1, textAlign: 'left' }}>AI WebDev</span>
        <Link href={document.location.href.split('#')[0]} sx={{ color: "#ccc", textDecoration: 'none', fontSize: '0.6em' }}>
          {appName || appId}
        </Link>
      </DialogTitle>
      <DialogContent className="custom-scrollbar" sx={{ height: '380px', overflowY: 'auto' }}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="AI Prompt" sx={{ '&:focus, &:active': { borderColor: 'white', outline: 'none' } }} />
          <Tab label="Images" sx={{ '&:focus, &:active': { borderColor: 'white', outline: 'none' } }} />
          <Tab label="Prompts" sx={{ '&:focus, &:active': { borderColor: 'white', outline: 'none' } }} />
          <Tab label="Templates" sx={{ '&:focus, &:active': { borderColor: 'white', outline: 'none' } }} />
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          <Box position="relative">
            <TextField
              value={aiPromptValue}
              onChange={handleChange}
              label="Prompt"
              multiline
              rows={5}
              variant="outlined"
              fullWidth
              InputProps={{ style: { minHeight: '100px' } }}
            />
            {loading && (
              <Backdrop sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }} open={loading}>
                <CircularProgress color="inherit" />
              </Backdrop>
            )}
          </Box>
          <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
            {selectedOption === 'generate' ? 'Specify how you want to modify the page' : 'Ask information about this page design and backend resources'}
          </Typography>
          <RadioGroup aria-label="options" name="options" value={selectedOption} onChange={handleOptionChange} row sx={{ marginTop: '8px' }}>
            <FormControlLabel value="generate" control={<Radio />} label="Generate" />
            <FormControlLabel value="question" control={<Radio />} label="Question" />
          </RadioGroup>
          <Button onClick={handleSubmit} color="primary" variant="outlined" disabled={loading || !aiPromptValue} sx={{ '&:focus, &:active': { borderColor: 'white', outline: 'none' } }}>
            Submit
          </Button>
        </TabPanel>
        <TabPanel value={selectedTab} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                value={imagePrompt}
                onChange={handleImagePromptChange}
                label="Image Prompt"
                multiline
                rows={2}
                variant="outlined"
                fullWidth
                InputProps={{ style: { minHeight: '50px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" color="primary" sx={{ width: '12em', '&:focus, &:active': { borderColor: 'white', outline: 'none' } }}>
                Generate Image
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" sx={{ width: '12em', '&:focus, &:active': { borderColor: 'white', outline: 'none' } }}>
                Upload File
                <input type="file" hidden onChange={handleImageUpload} />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Link component="button" color="textSecondary" onClick={toggleImageDialog} style={{ marginBottom: '8px', textDecoration: 'none' }} sx={{ '&:focus, &:active': { borderColor: 'white', outline: 'none' } }}>
                Uploaded Images
              </Link>
              <List>
                {imageNames.map((name, index) => (
                  <ListItem key={index}>{name}</ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </TabPanel>
        <TabPanel value={selectedTab} index={2}>
          <ComponentList type={"prompt"} key={refreshVersion} />
        </TabPanel>
        <TabPanel value={selectedTab} index={3}>
          <ComponentList type={"template"} key={refreshVersion} />
        </TabPanel>
      </DialogContent>
      <DialogActions>
        {appId}
        <Button onClick={toggleSaveDialog} variant="outlined" disabled={loading}>
          Save
        </Button>
        <Button onClick={toggleDialog} color="secondary" variant="outlined" sx={{ '&:focus, &:active': { borderColor: 'white', outline: 'none' } }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SaveDialog = ({ isSaveDialogOpen, toggleSaveDialog, saveName, handleSaveNameChange, handleSave, loading }) => {
  return (
    <Dialog
      open={isSaveDialogOpen}
      onClose={toggleSaveDialog}
      PaperComponent={PaperComponent}
      aria-labelledby="save-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle style={{ cursor: 'move' }} id="save-dialog-title">
        Save Prompt
      </DialogTitle>
      <DialogContent>
        <TextField
          value={saveName}
          onChange={handleSaveNameChange}
          label="Name"
          variant="outlined"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary" variant="outlined" disabled={loading || !saveName} sx={{ '&:focus, &:active': { borderColor: 'white', outline: 'none' } }}>
          Save
        </Button>
        <Button onClick={toggleSaveDialog} color="secondary" variant="outlined" sx={{ '&:focus, &:active': { borderColor: 'white', outline: 'none' } }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const UploadedImagesDialog = ({ isImageDialogOpen, toggleImageDialog, imageNames }) => {
  return (
    <Dialog
      open={isImageDialogOpen}
      onClose={toggleImageDialog}
      PaperComponent={PaperComponent}
      aria-labelledby="uploaded-images-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle style={{ cursor: 'move' }} id="uploaded-images-dialog-title">
        Uploaded Images
      </DialogTitle>
      <DialogContent className="custom-scrollbar" sx={{ height: '350px', overflowY: 'auto' }}>
        <List>
          {imageNames.map((name, index) => (
            <ListItem key={index}>{name}</ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleImageDialog} color="secondary" variant="outlined" sx={{ '&:focus, &:active': { borderColor: 'white', outline: 'none' } }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AIQuery = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aiPromptValue, setAiPromptValue] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [imageNames, setImageNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('generate');
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const dataProvider = useDataProvider();
  const [refreshVersion, setRefreshVersion] = useState(0);

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const toggleImageDialog = () => {
    setIsImageDialogOpen(!isImageDialogOpen);
  };

  const toggleSaveDialog = () => {
    setIsSaveDialogOpen(!isSaveDialogOpen);
  };

  const handleChange = (event) => {
    setAiPromptValue(event.target.value);
  };

  const handleImagePromptChange = (event) => {
    setImagePrompt(event.target.value);
  };

  const handleSaveNameChange = (event) => {
    setSaveName(event.target.value);
  };

  const handleSubmit = async () => {
    if (!aiPromptValue) {
      console.log("Submit without prompt");
      return;
    }
    setLoading(true);
    await handleAIQuery(dataProvider, `${aiPromptValue}`);
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    await dataProvider.create('SPAComponent', {
      data: {
        Type: "save",
        name: saveName,
        project_id: getAppId(),
      }
    });
    setLoading(false);
    toggleSaveDialog();
    setRefreshVersion(refreshVersion + 1);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageNames([...imageNames, file.name]);
      alert(`Uploaded Image: ${file.name}`);
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <Draggable>
        <div
          style={{
            display: 'inline-block',
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            background: 'transparent',
          }}
        >
          <IconButton
            onClick={toggleDialog}
            color="primary"
            style={{
              width: '70px',
              height: '70px',
              backgroundColor: 'transparent',
              borderRadius: '50%',
              padding: 0,
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:focus, &:active': {
                borderColor: 'white',
                outline: 'none',
              },
            }}
          >
            <ChatIcon style={{ fontSize: '36px' }} />
          </IconButton>
        </div>
      </Draggable>

      <MainDialog
        isDialogOpen={isDialogOpen}
        toggleDialog={toggleDialog}
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        aiPromptValue={aiPromptValue}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
        selectedOption={selectedOption}
        handleOptionChange={handleOptionChange}
        imagePrompt={imagePrompt}
        handleImagePromptChange={handleImagePromptChange}
        handleImageUpload={handleImageUpload}
        imageNames={imageNames}
        toggleImageDialog={toggleImageDialog}
        refreshVersion={refreshVersion}
        toggleSaveDialog={toggleSaveDialog}
      />

      <SaveDialog
        isSaveDialogOpen={isSaveDialogOpen}
        toggleSaveDialog={toggleSaveDialog}
        saveName={saveName}
        handleSaveNameChange={handleSaveNameChange}
        handleSave={handleSave}
        loading={loading}
      />

      <UploadedImagesDialog
        isImageDialogOpen={isImageDialogOpen}
        toggleImageDialog={toggleImageDialog}
        imageNames={imageNames}
      />
    </div>
  );
};

export default AIQuery;