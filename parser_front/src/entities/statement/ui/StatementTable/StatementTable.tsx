import { Heading, Table, TableContainer, Tbody } from '@chakra-ui/react';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { statementApi } from 'src/shared/api';
import { ROUTE } from 'src/shared/routes';
import { Spinner } from 'src/shared/Spinner';
import { useFetch } from 'src/shared/useFetch';
import { useNotify } from 'src/shared/useNotify';

import { statement } from '../../model';
import { StatementHead } from '../StatementHead';
import { StatementRow } from '../StatementRow';
import { StatementSummary } from '../StatementSummary';
import styles from './StatementTable.module.scss';

export const StatementTable = observer(() => {
  const { addErrorMessage } = useNotify();

  const [{ isLoading }, fetchData] = useFetch(statementApi.getStatementRequest, {
    init: { currencies: { sourceCurrency: null, targetCurrency: null }, name: '', transactions: [] },
    onError: addErrorMessage,
    onSuccess: ({ data: { currencies, name, transactions } }) => {
      statement.transactions = transactions;
      statement.title = name;
      statement.currencies = currencies;
    },
  });

  const { statementId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (statementId) void fetchData({ name: statementId });
  }, [fetchData, statementId]);

  if (!statementId) navigate(ROUTE.STATEMENTS);

  if (isLoading) return <Spinner center size="xl" />;

  return (
    <>
      <Heading as="h1" mb="5" textAlign="center">
        {statement.title}
      </Heading>
      <StatementSummary
        convertedSummary={statement.convertedSummary}
        currencies={statement.currencies}
        summary={statement.summary}
      />
      <TableContainer className={styles.tableContainer}>
        <Table className={styles.table} variant="simple">
          <StatementHead />
          <Tbody>
            {statement.transactions.map((row) => (
              <StatementRow key={row.id} row={row} />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
});
