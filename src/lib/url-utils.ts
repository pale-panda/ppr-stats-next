interface SessionUrlParams {
  slug: string;
  year?: string;
  id?: string;
}

export function createSessionUrl(
  session: SessionUrlParams,
  pathname: string | undefined = '',
) {
  return `${pathname ? `${pathname}/` : ''}${session.slug}${session.year ? `/${session.year}` : ''}${session.id ? `/${session.id}` : ''}`;
}
