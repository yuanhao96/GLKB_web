import React from 'react';
import { Stack, Chip, TextField, Button, Select, MenuItem, FormControl,
    InputLabel, Box, Container, Typography, Autocomplete, Card} from '@mui/material';
export default function SearchBarKnowledge() {
    const [sourceNode, setSourceNode] = React.useState('');
    const [relationship, setRelationship] = React.useState('');
    const [targetNode, setTargetNode] = React.useState('');
    const [inputValue, setInputValue] = React.useState('');
    const [sourceNodeOptions, setSourceNodeOptions] = React.useState([]);
    const [targetNodeOptions, setTargetNodeOptions] = React.useState([]);
    const [chipData, setChipData] =React.useState([
        { key: 0, label: 'AAA' },
        { key: 1, label: 'BBB' },
        { key: 2, label: 'CCC' },
    ]);



    const handleRelationshipChange = (event) => {
        setRelationship(event.target.value);
    };

    const handleTargetNodeChange = (event) => {
        setTargetNode(event.target.value);
    };

    const handleSubmit = () => {
        // Implement the search functionality
        console.log(sourceNode, relationship, targetNode);
    };

    const relationTypes = ["include", "Type1", "Type2", "Type3"];



    const updateSourceOptionsBasedOnInput = (value) => {
        if (value.trim() === '') {
            setSourceNodeOptions([]);
        } else {
            // change this part to call the apis
            setSourceNodeOptions([
                `Option ${value}`,
                `Option ${value + "4"}`,
                `Option ${value + "$$$$"}`,
            ]);
            setSourceNode(value);
        }
    };

    const [options, setOptions] = React.useState([]);
    const initialOptions = ['Node 1', 'Node 2', 'Node 3'];

    const handleInputChange = (event, newInputValue) => {
        setInputValue(newInputValue);
        // You would typically fetch the filtered options based on the input value
        // For now, we'll just filter the static list of initialOptions
        const filteredOptions = initialOptions.filter((option) =>
            option.toLowerCase().includes(newInputValue.toLowerCase())
        );
        setOptions(filteredOptions);
    };
    const handleSearch = () => {
        // Perform the search logic and update the chipData
        // This is just a placeholder logic
        const newData = [
            { key: 0, label: 'Example Chip 1' },
            { key: 1, label: 'Example Chip 2' },
            // ... add more data as needed
        ];
        setChipData(newData);
    };

    const handleClick = () => {
        console.info('You clicked the Chip.');
    };

    const handleDelete = () => {
        console.info('You clicked the delete icon.');
    };


    return (
        <Container maxWidth="md">
            <Box sx={{ marginTop: 4 }}>

                <Box display="flex" alignItems="center" gap={2} p={2}>
                    <FormControl fullWidth>
                    <Autocomplete
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                            setInputValue(newInputValue);
                            updateSourceOptionsBasedOnInput(newInputValue);
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
                            onChange={handleRelationshipChange}
                        >
                            {relationTypes.map((type)=>(
                                <MenuItem value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                    {/*<FormControl fullWidth>*/}
                    {/*<Autocomplete*/}
                    {/*    freeSolo*/}
                    {/*    inputValue={inputValue}*/}
                    {/*    onInputChange={handleInputChange}*/}
                    {/*    options={options}*/}
                    {/*    value={targetNode}*/}
                    {/*    onChange={(event, newValue) => {*/}
                    {/*        setTargetNode(newValue);*/}
                    {/*    }}*/}
                    {/*    renderInput={(params) => (*/}
                    {/*        <TextField {...params} label="Target Node" variant="outlined" />*/}
                    {/*    )}*/}
                    {/*/>*/}
                    {/*</FormControl>*/}


                    <FormControl fullWidth>
                        <TextField
                            id="target-node"
                            label="Target Node"
                            value={targetNode}
                            onChange={handleTargetNodeChange}
                        />
                    </FormControl>

                    <Button variant="contained" color="primary"
                            sx={{ minWidth:'100px', backgroundColor: '#8BB5D1', color: 'black', '&:hover': { backgroundColor: '#4A7298' } }}
                            onClick={handleSubmit}>
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
                                        key = {data.key}
                                        label={data.label}
                                        // variant="outlined"
                                        onClick={handleClick}
                                        onDelete={handleDelete}
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
