import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useEffect, useReducer, useState } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  LinearProgress
} from '@mui/material';
// components
import useHttp from 'src/utils/http';
import BudgetTable from '../components/BudgetTable';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import AppContext from 'src/context/AppContext';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
import CATEGORIES_LIST from '../_mocks_/categories';
//
import BUDGET_LIST from '../_mocks_/budgets';
import BudgetDialog from 'src/dialogs/BudgetDialog';
import CategoryDialog from 'src/dialogs/CategoryDialog';
import { APP_CONFIG } from 'src/config';

// ----------------------------------------------------------------------

function ccyFormat(num) {
  return `$${num.toFixed(2)}`;
}

const TABLE_HEAD = [
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
  { id: 'category', label: 'Category', alignRight: false },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const ACTIONS = {
  SET_BUDGETS: 'SET_BUDGETS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  HANDLE_RESET: 'HANDLE_RESET',
}

const transactionsReducer = (curTrasactionState, action) => {
  switch (action.type) {
    case ACTIONS.SET_BUDGETS:
      return { ...curTrasactionState, budgets: action.budgets }
    case ACTIONS.SET_CATEGORIES:
      return { ...curTrasactionState, categories: action.categories, categoryMap: action.categoryMap };
    default:
      throw new Error('Should not get here');
  }
}

export default function Budget(props) {
  const [page, setPage] = useState(0);
  const { isLoading, data, error, sendRequest, reqExtra, isOpen } = useHttp();
  const [{ budgets, categories, categoryMap }, dispatchTransactions] = useReducer(transactionsReducer,
    { budgets: [], categories: [], categoryMap: {} });
  const [openCategory, setOpenCategory] = useState(false);
  const [openBudget, setOpenBudget] = useState(false);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const loadBudgets = () => {
    sendRequest(APP_CONFIG.APIS.GET_BUDGETS, 'GET', null, APP_CONFIG.APIS.GET_BUDGETS);
  };

  const getCategories = () => {
    sendRequest(APP_CONFIG.APIS.GET_CATEGORIES, 'GET', null, APP_CONFIG.APIS.GET_CATEGORIES);
  };

  const openBudgetCategory = () => {
    setOpenCategory(true);
  };

  const closeBudegtCategory = () => {
    setOpenCategory(false);
  };

  const handleOpenBudget = () => {
    setOpenBudget(true);
  };

  const handleCloseBudget = () => {
    setOpenBudget(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = BUDGET_LIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - BUDGET_LIST.length) : 0;

  const filteredUsers = applySortFilter(
    BUDGET_LIST,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredUsers.length === 0;

  useEffect(() => {
    switch (reqExtra) {
      case APP_CONFIG.APIS.GET_BUDGETS:
        if (data && !error) {
          dispatchTransactions({ type: ACTIONS.SET_BUDGETS, budgets: data });
        } else if(error){
          props.handleSnackbar("Failed to fetch budgets!", "error");
        }
        //TODO
        
        break;
      case APP_CONFIG.APIS.GET_CATEGORIES:
        //TODO
        var data = CATEGORIES_LIST;
        if (data) {
          var categoryMapTemp = {};
          if (data.length) {
            data.forEach(e => {
              categoryMapTemp[e.categoryId] = e;
            });
          }

          dispatchTransactions({ type: ACTIONS.SET_CATEGORIES, categories: data, categoryMap: categoryMapTemp });
        } else if (error) {
          props.handleSnackbar("Failed to fetch categories!", "error");
        }
        break;
      default:
        break;
    }
  }, [data, reqExtra, isOpen, isLoading, error]);

  useEffect(() => {
    loadBudgets();
    getCategories();
  }, [])

  return (
    <Page title="Budgets | Minimal-UI">
      <AppContext.Consumer>
        {context => {
          return (
            <>
              <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                  <Typography variant="h4" gutterBottom>
                    Budgets
                  </Typography>
                  
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Button
                      onClick={openBudgetCategory}
                      variant="contained"
                      component={RouterLink}
                      color="warning"
                      to="#"
                    // startIcon={<Icon icon={plusFill} />}
                    >
                      Add/Remove Categories
                    </Button>
                    <Button
                      onClick={handleOpenBudget}
                      variant="contained"
                      component={RouterLink}
                      to="#"
                      startIcon={<Icon icon={plusFill} />}
                    >
                      New Budget
                    </Button>
                  </Stack>
                </Stack>

                <Card>
                <div>
                  {isLoading && <LinearProgress />}
                </div>
                  {/* <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          /> */}

                  <Scrollbar>
                    <BudgetTable budgets={budgets} categoryMap={categoryMap}/>
                  </Scrollbar>

                  {/* <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={BUDGET_LIST.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  /> */}
                </Card>
              </Container>
              <CategoryDialog open={openCategory} handleClose={closeBudegtCategory} handleSnackbar={context.handleSnackbar} />
              <BudgetDialog open={openBudget} handleClose={handleCloseBudget} handleSnackbar={context.handleSnackbar}/>
            </>
          );
        }}
      </AppContext.Consumer>

    </Page>
  );
}
