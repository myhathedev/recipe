import React, { useState, useEffect } from 'react';
import { Input, Button, Stack, Typography, Card, CardContent } from '@mui/joy';
import { Pagination } from '@mui/material';
import ApiServices from '../services/api';
import AspectRatio from '@mui/joy/AspectRatio';
import Link from '@mui/joy/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import {cuisines} from '../services/data.js';
import { useNavigate ,useLocation } from 'react-router-dom';

const CUISINES = cuisines
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Home = () => {
    const [keyword, setKeyword] = useState('');
    const [error, setError] = useState('');
    const [noresult, setNoResult] = useState('');
    const [displayKeyword, setDisplayKeyword] = useState('');
    const [result, setResult] = useState([]);
    const [page, setPage] = useState(1);
    const [cuisines, setCuisines] = React.useState([]);
    const itemsPerPage = 5;
    const navigate = useNavigate();
    const changeKeyword = (e) => setKeyword(e.target.value);

    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const keywordParam = searchParams.get('keyword') || '';
        const cuisineParam = (searchParams.get('cuisine') || '').split(',');

        if (keywordParam || searchParams.get('cuisine')) {
            async function search() {
                let new_results = [];
                setError('');
                const res = await ApiServices.searchRecipe(keywordParam, cuisineParam);
                if (res && Array.from(res.results).length > 0) {
                    new_results = res.results;
                    setDisplayKeyword(keywordParam);
                    setNoResult('');
                } else {
                    setNoResult('No result found.');
                }
                setResult(new_results);
            }
            search();
            setKeyword(keywordParam); 
            setCuisines(cuisineParam);
        }
    }, [location.search]); 

    const handleSubmit = async () => {
        if (!keyword) {
            setError('Please enter a keyword.');
            return;
        }
        let new_results = []
        setError('');
        const res = await ApiServices.searchRecipe(keyword,cuisines);
        if (res && Array.from(res.results).length > 0 ) {
            new_results = res.results
            setDisplayKeyword(keyword);
            const queryParams = new URLSearchParams({
                keyword: keyword,
                cuisine: cuisines
            }).toString();
            navigate(`?${queryParams}`, { replace: true });
            setNoResult('');
        } else {
            setNoResult('No result found.');
        }
        setResult(new_results); 
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

// filter
    const handleChangeCuisine = (event) => {
        const {
            target: { value },
            } = event;
            setCuisines(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

// pagination
    const totalPages = Math.ceil(result.length / itemsPerPage);
    const handlePageChange = (event, value) => setPage(value);
    const currentItems = result.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div>
            <Stack
                direction="column"
                spacing={2}
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2rem 1rem',
                    maxWidth: '600px',
                    margin: 'auto'
                }}
            >
                 <Typography
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        width: '100%',
                        color: '#9A5B13',
                        fontSize : '2rem'
                    }}
                >
                    Find Your Recipes
                </Typography>
                <Input
                    color="warning"
                    size="lg"
                    variant="outlined"
                    placeholder="Enter a keyword"
                    value={keyword}
                    onChange={changeKeyword}
                    onKeyDown={handleKeyPress}
                    endDecorator={
                        <Button color="warning" onClick={handleSubmit}>
                            Search
                        </Button>
                    }
                />
                {error && <div>{error}</div>}
                 <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="cusine-label">Cuisine</InputLabel>
                    <Select
                        labelId="cusine-label"
                        id="cuisine-select"
                        multiple
                        color ="warning"
                        value={cuisines}
                        onChange={handleChangeCuisine}
                        input={<OutlinedInput label="Cuisine" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                    >
                {CUISINES.map((name) => (
                    <MenuItem key={name} value={name}>
                    <Checkbox checked={cuisines.includes(name)} />
                    <ListItemText primary={name} />
                    </MenuItem>
                ))}
                </Select>
                </FormControl>
            </Stack>

            {displayKeyword && (
                <>
                <Typography
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        width: '100%'
                    }}
                >
                    Keyword: {displayKeyword}
                </Typography>
                {cuisines.length> 0 && 
                    <Typography
                        sx={{
                            textAlign: 'center',
                            width: '100%'
                        }}
                    >
                        {cuisines.join(', ')}
                    </Typography>}
                </>
            )}

            {noresult && 
                <Typography
                    sx={{
                        textAlign: 'center',
                        width: '100%'
                    }}
                >
                    {noresult}
                </Typography>}

            {result.length > 0 && (
                <Stack
                    direction="column"
                    spacing={4}
                    sx={{ justifyContent: 'center', alignItems: 'center', paddingBottom: '4rem' }}
                >
                    <Typography>Found {result.length} result(s).</Typography>
                    <Stack
                        direction="row"
                        sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
                    >
                        {currentItems.map((item, index) => (
                            <div key={index}>
                                <Link href={`/product-detail/${item.id}`} underline='none' color="warning">
                                    <Card
                                        color="warning"
                                        variant="outlined"
                                        sx={{
                                            width: 230,
                                            margin: '0.5rem',
                                            height: 300,
                                            boxShadow: '5px 5px 5px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <AspectRatio minHeight="200px" maxHeight="200px">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </AspectRatio>
                                        <CardContent orientation="horizontal">
                                            <Typography
                                                sx={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    color: '#72430D',
                                                    width: '100%'
                                                }}
                                            >
                                                {item.title}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                        ))}
                    </Stack>
                    <Pagination
                        count={totalPages}
                        variant="outlined"
                        page={page}
                        onChange={handlePageChange}
                    />
                </Stack>
            )}
        </div>
    );
};

export default Home;
