import { Box, Center, Flex, Link, List, ListItem, Spinner, Stack, Text } from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import { Error } from 'components/error';
import { FormListItem } from 'components/form-list-item';
import { FormWrapper } from 'components/form-wrapper';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import { routes } from 'routes';
import useSWR from 'swr';
import { compose } from 'lib/compose';
import {
  AccessOperationEnum,
  AccessServiceEnum,
  requireNextAuth,
  useAuthorizationApi,
  withAuthorization,
} from '@roq/nextjs';
import { UserPageTable } from 'components/user-page-table';

import { getRentalById } from 'apiSdk/rentals';
import { RentalInterface } from 'interfaces/rental';

function RentalViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RentalInterface>(
    () => (id ? `/rentals/${id}` : null),
    () =>
      getRentalById(id, {
        relations: ['user', 'tool', 'outlet'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Rentals',
              link: '/rentals',
            },
            {
              label: 'Rental Details',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <FormWrapper wrapperProps={{ border: 'none', gap: 3, p: 0 }}>
              <Text
                sx={{
                  fontSize: '1.875rem',
                  fontWeight: 700,
                  color: 'base.content',
                }}
              >
                Rental Details
              </Text>
              <List spacing={2} w="100%">
                <FormListItem
                  label="Rental Start:"
                  text={format(parseISO(data?.rental_start as unknown as string), 'dd.MM.yyyy')}
                />

                <FormListItem
                  label="Rental End:"
                  text={format(parseISO(data?.rental_end as unknown as string), 'dd.MM.yyyy')}
                />

                <FormListItem
                  label="Created At:"
                  text={format(parseISO(data?.created_at as unknown as string), 'dd.MM.yyyy')}
                />

                <FormListItem
                  label="Updated At:"
                  text={format(parseISO(data?.updated_at as unknown as string), 'dd.MM.yyyy')}
                />

                {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="User:"
                    text={
                      <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                        {data?.user?.email}
                      </Link>
                    }
                  />
                )}
                {hasAccess('tool', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Tool:"
                    text={
                      <Link as={NextLink} href={`/tools/view/${data?.tool?.id}`}>
                        {data?.tool?.name}
                      </Link>
                    }
                  />
                )}
                {hasAccess('outlet', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                  <FormListItem
                    label="Outlet:"
                    text={
                      <Link as={NextLink} href={`/outlets/view/${data?.outlet?.id}`}>
                        {data?.outlet?.name}
                      </Link>
                    }
                  />
                )}
              </List>
            </FormWrapper>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'rental',
    operation: AccessOperationEnum.READ,
  }),
)(RentalViewPage);
