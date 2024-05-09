import Moment from 'react-moment';

export interface SingleBookmarkProps {
  imageUrl: string;
  title: string;
  dateAdded: string;
  description: string;
  tags: BookmarkTag[];
}

export interface BookmarkTag {
  name: string;
  icon: string;
}

export function SingleBookmark({
  title,
  imageUrl,
  dateAdded,
  description,
  tags,
}: SingleBookmarkProps) {
  return (
    <div>
      <img
        className="aspect-[3/2] w-full rounded-2xl object-cover"
        src={imageUrl}
        alt=""
      />
      <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">
        {title}
      </h3>
      <p className="text-base leading-7 text-gray-600">
        <Moment format="MMM DD, YYYY">{dateAdded}</Moment>
      </p>
      <p className="mt-4 text-base leading-7 text-gray-600">{description}</p>
      <ul className="mt-6 flex gap-x-6">
        {tags.map((tag) => (
          <li key={tag.name} className="flex items-center text-sm">
            <svg
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d={tag.icon} clipRule="evenodd" />
            </svg>
            <span className="text-gray-500">{tag.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
