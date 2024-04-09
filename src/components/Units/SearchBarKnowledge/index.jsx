import React from 'react';
import { Stack, Chip, TextField, Button, Select, MenuItem, FormControl,
    InputLabel, Box, Container, Typography, Autocomplete, Card, Grid} from '@mui/material';
import { FormGroup, FormControlLabel, Switch } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function SearchBarKnowledge() {

    const [relationship, setRelationship] = React.useState('');
    const [sourceNodeOptions, setSourceNodeOptions] = React.useState([]);
    const [targetNodeOptions, setTargetNodeOptions] = React.useState([]);
    const [chipData, setChipData] =React.useState([]);
    const [triplets, setTriplets] = React.useState(["", "", ""]); // Represent source, rel, target
    const [expanded, setExpanded] = React.useState(false);
    const [maxArticles, setMaxArticles] = React.useState(0);
    const [maxBioTerms, setMaxBioTerms] = React.useState(0);
    const [maxRel, setMaxRel] = React.useState(0);
    const [moreNodes, setMoreNodes] = React.useState(false);
    const [moreRel, setMoreRel] = React.useState(false);

    const showAdvance = true;
    const relationTypes = ["include", "Type1", "Type2", "Type3"];

    const example_data = {
        "triplets": [
            {
                "source": [91717148, "CYP1A1"],
                "rel": "",
                "target": [92079547, "Leukemia, Myeloid, Acute"]
            },
            {
                "source": [92079547, "Leukemia, Myeloid, Acute"],
                "rel": "Associate",
                "target": []
            }
        ],
        "params": {
            "max_articles": 50,
            "max_terms": 20,
            "max_rels": 100,
            "more_terms": "True",
            "more_rels": "True"
        }
    };


    const updateSource = (value) => {
        if (value.trim() === '') {
            setSourceNodeOptions([]);
        } else {
            // setSourceNodeOptions([
            //     `Option ${value}`,
            //     `Option ${value + "4"}`,
            //     `Option ${value + "$$$$"}`,
            // ]);
            // TODO: Connect and set this to call API to autocomplete
            setSourceNodeOptions([
                value
            ]);
            const newTriplet = [value, triplets[1], triplets[2]];
            setTriplets(newTriplet);

        }
    };

    const updateTarget = (value) => {
        if (value.trim() === '') {
            setTargetNodeOptions([]);
        } else {
            // setSourceNodeOptions([
            //     `Option ${value}`,
            //     `Option ${value + "4"}`,
            //     `Option ${value + "$$$$"}`,
            // ]);
            // TODO: Connect and set this to call API to autocomplete
            setTargetNodeOptions([
                value
            ]);
            const newTriplet = [triplets[0], triplets[1], value];
            setTriplets(newTriplet);

        }
    };

    const updateRelationship = (event) => {
        setRelationship(event.target.value);
        setTriplets([triplets[0], event.target.value, triplets[2]]);
    };
    //Handle advance params
    const updateMaxArticles = (event)=> {
        setMaxArticles(event.target.value);
        // console.log(event.target.value);
    };
    const updateMaxBioTerms = (event)=>{
        setMaxBioTerms(event.target.value);
    }

    const updateMaxRel = (event)=>{
        setMaxRel(event.target.value);
    }

    const updateMoreNodes = (event) =>{
        setMoreNodes(event.target.checked);
    }

    const updateMoreRel = (event) =>{
        setMoreRel(event.target.checked);
    }


    // const handleClick = () => {
    //     console.info('You clicked the Chip.');
    // };

    //This function is called after clicked on the delete cross button on the chip
    const handleDelete = (data) => {
        const newChipData = chipData.filter(chip => chip !== data);
        setChipData(newChipData);
    };



    const handleToggle = () => {
        setExpanded(!expanded);
    };

    //This function is called after click on Add Triplet button, adding three fields of the triplets to ChipData
    const handleAddTriplet = () =>{
        if (triplets[0] === "" && triplets[1] === "" && triplets[2] === "") return;

        // let newKey = chipData.length;
        let chip_str = triplets.map(item => item === "" ? "null" : item).join(", ");
        if (chipData.includes((chip_str))) return;
        // chipData.push({key:newKey, label:''})
        // const newData = [...chipData, {key:newKey, label:chip_str}]
        const newData = [...chipData, chip_str];
        setChipData(newData);
    }

    // This function is called after clicking on the search button
    const handleSearch = () => {
        // Here should trigger search result api and route to the result page
        console.log("searching result with data: ");
        console.log(chipData); // Here need to trim the data before send to backend
        console.log(maxArticles);
        console.log(maxRel);
        console.log(maxBioTerms);
        console.log(moreNodes);
        console.log(moreRel);
        //Create search result based on the status
        let search_data = {
            "triplets": chipData.map(triplet =>{
                const parts = triplet.split(", ");
                return {
                    "source": parts[0],
                    "rel": parts[1],
                    "target": parts[2]
                };
            }),
            "params": {
                "max_articles": maxArticles,
                "max_terms": maxBioTerms,
                "max_rels": maxRel,
                "more_terms": moreNodes===true ? "True":"False",
                "more_rels": moreRel===true ? "True":"False"
            }
        };
        console.log(search_data);

    };

    const boxStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '16px',
    };

    const formGroupStyle = {
        padding: '16px',
        // border: '1px solid #ccc',
        borderRadius: '8px',
        marginBottom: '16px',
        display: expanded ? 'block' : 'none',
    };

    const buttonStyle = {
        textTransform: 'none', // Prevents uppercase transformation
        color: 'blue', // Adjust color as needed
        fontWeight: 'bold', // Adjust font weight as needed
        fontSize: '16px', // Adjust font size as needed
    };



    return (
        <Container maxWidth="md">
            <Box sx={{ marginTop: 4 }}>

                <Box display="flex" alignItems="center" gap={2} p={2}>
                    <FormControl fullWidth>
                    <Autocomplete
                        // inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                            updateSource(newInputValue);
                        }}
                        options={sourceNodeOptions}
                        renderInput={(params) => (
                            <TextField {...params} label="Source Node" variant="outlined" />
                        )}
                    />
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="relationship-label">Relationship(Optional)</InputLabel>
                        <Select
                            labelId="relationship-label"
                            id="relationship"
                            value={relationship}
                            label="Relationship"
                            onChange={updateRelationship}
                        >
                            {relationTypes.map((type)=>(
                                <MenuItem value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <Autocomplete
                            // inputValue={inputValue}
                            onInputChange={(event, newInputValue) => {
                                updateTarget(newInputValue);
                            }}
                            options={targetNodeOptions}
                            renderInput={(params) => (
                                <TextField {...params} label="Target Node" variant="outlined" />
                            )}
                        />
                    </FormControl>


                    <Button variant="contained" color="primary"
                            sx={{ minWidth:'120px', backgroundColor: '#8BB5D1', color: 'black', '&:hover': { backgroundColor: '#4A7298' } }}
                            onClick={handleAddTriplet}>
                        Add Triplet
                    </Button>
                </Box>
                <Box display="flex" alignItems="center" gap={2} p={2}>
                    {/* Data display area with chips */}
                    <FormControl>
                        <Card variant="outlined"
                                sx={{ width:'650px'}}
                        >
                            <Stack direction="row" spacing={1} sx={{ marginY: 2 }}>
                                {chipData.map((data) => (
                                    <Chip

                                        label={data}
                                        // variant="outlined"
                                        // onClick={handleClick}
                                        onDelete={() => handleDelete(data)}
                                    />
                                ))}
                            </Stack>
                        </Card>

                    </FormControl>

                    <Button variant="contained" color="primary"
                            sx={{ minWidth:'100px', backgroundColor: '#F7EFAE', color: 'black', '&:hover': { backgroundColor: '#F3C846' } }}
                            onClick={handleSearch}>
                        Search
                    </Button>
                </Box>

                {showAdvance && (
                <Box style={boxStyle}>
                    <Button
                        variant="text"
                        endIcon={<ExpandLessIcon />}
                        style={buttonStyle}
                        onClick={handleToggle}
                        sx={{width:'200px'}}
                    >
                        Advanced Search
                    </Button>
                    {/*<Button variant="contained"  style={buttonStyle}>*/}
                    {/*    Advanced Search*/}
                    {/*</Button>*/}
                    <Box style={formGroupStyle}>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={6}>
                                <TextField
                                    id="max-articles"
                                    label="Maximum articles:"
                                    type="number"
                                    variant="outlined"
                                    // size="small"
                                    onChange={(event) => updateMaxArticles(event)}
                                    // InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel
                                    control={<Switch
                                        checked = {moreNodes}
                                        onChange = {(event)=>updateMoreNodes(event)}
                                    />}
                                    label="More nodes"
                                    labelPlacement="start"
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    label="Maximum biomedical terms:"
                                    variant="outlined"
                                    type="number"
                                    // size="small"
                                    margin="normal"
                                    onChange={(event) => updateMaxBioTerms(event)}
                                    // InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel
                                    control={<Switch
                                        checked = {moreRel}
                                        onChange = {(event)=>updateMoreRel(event)}
                                    />}
                                    label="More relationships"
                                    labelPlacement="start"
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    label="Maximum relationships:"
                                    variant="outlined"
                                    // size="small"
                                    type="number"
                                    margin="normal"
                                    onChange={(event) => updateMaxRel(event)}
                                    // InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    {/*<Button variant="contained" color="primary" style={buttonStyle}>*/}
                    {/*    Search*/}
                    {/*</Button>*/}
                </Box>
                )}

                {/* ... more UI components as needed ... */}
            </Box>

        </Container>
    );
}





















//
//
// import React, { useState } from 'react';
// import { Input, Select,  Space, SelectProps } from 'antd';
// import './scoped.css'; // Import the CSS file for styling
// import Button from '@mui/material/Button';
//
// import Chip from '@mui/material/Chip';
// import Stack from '@mui/material/Stack';
//
//
// const { Option } = Select;
//
//
// const SearchBarKnowledge = () => {
//     const [inputValue, setInputValue] = useState('');
//     const [showLog, setShowLog] = useState(false);
//
//     const handleInputChangeField1 = (e) => {
//         const value = e.target.value;
//         setInputValue(value);
//         setShowLog(value !== ''); // Set showLog to false when the input is empty
//     };
//
//     for (let i = 10; i < 36; i++) {
//         options.push({
//             label: i.toString(36) + i,
//             value: i.toString(36) + i,
//         });
//     }
//
//
//     const handleChange = (value) => {
//         console.log(`selected ${value}`);
//     };
//
//     const handleDelete = () => {
//         console.info('You clicked the delete icon.');
//     };
//
//     return (
//         <div className="search-bar-container">
//             <Select
//                 mode="tags"
//                 style={{ width: '100%' }}
//                 placeholder="Tags Mode"
//                 onChange={handleChange}
//                 options={options}
//             />
//             <Space style={{ width: '100%' }} direction="vertical">
//                 <Select
//                     mode="multiple"
//                     allowClear
//                     style={{ width: '100%' }}
//                     placeholder="Please select"
//                     defaultValue={['a10', 'c12']}
//                     onChange={handleChange}
//                     options={options}
//                 />
//                 <Select
//                     mode="multiple"
//                     style={{ width: '100%' }}
//                     placeholder="Please select"
//                     defaultValue={['a10', 'c12']}
//                 />
//             </Space>
//             <div className="input-container">
//                 <Input
//                     className="input-field"
//                     placeholder="First Field"
//                     value={inputValue}
//                     onChange={handleInputChangeField1}
//                 />
//                 {showLog && (
//                     <div className="log-box">
//                         Log: {inputValue}
//                     </div>
//                 )}
//             </div>
//             <Select
//                 className="dropdown-field"
//                 defaultValue="Relationship"
//                 onChange={setInputValue}
//                 style={{ width: 200 }}
//             >
//                 <Option value="1">1</Option>
//                 <Option value="2">2</Option>
//                 <Option value="3">3</Option>
//             </Select>
//             <div className="input-container">
//                 <Input
//                     className="input-field"
//                     placeholder="Third Field"
//                 />
//             </div>
//             <Button variant="contained">Hello World</Button>
//
//                 {/*<Button className="add-button" type="primary">Add triplet</Button>*/}
//             <Stack direction="row" spacing={1}>
//                 <Chip label="Deletable" onDelete={handleDelete} />
//                 <Chip label="Deletable" variant="outlined" onDelete={handleDelete} />
//             </Stack>
//
//         </div>
//     );
// };
//
// export default SearchBarKnowledge;
