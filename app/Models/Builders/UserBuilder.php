<?php

namespace App\Models\Builders;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

/**
 * @template TModelClass of User
 *
 * @extends Builder<TModelClass>
 */
class UserBuilder extends Builder
{
    /**
     * Add a basic where clause to the query, automatically hashing NIK if querying the 'nik' column.
     *
     * @param  mixed  $column
     * @param  mixed  $operator
     * @param  mixed  $value
     * @param  string  $boolean
     * @return $this
     */
    public function where($column, $operator = null, $value = null, $boolean = 'and')
    {
        if (is_string($column) && ($column === 'nik' || str_ends_with($column, '.nik'))) {
            if (func_num_args() === 2) {
                $operator = User::hashNik((string) $operator);
            } elseif ($value !== null) {
                $value = User::hashNik((string) $value);
            }
        } elseif (is_array($column)) {
            foreach ($column as $key => $val) {
                if (($key === 'nik' || str_ends_with((string) $key, '.nik')) && is_string($val)) {
                    $column[$key] = User::hashNik($val);
                }
            }
        }

        return parent::where($column, $operator, $value, $boolean);
    }

    /**
     * Add a "where in" clause to the query, hashing NIK values.
     *
     * @param  string  $column
     * @param  mixed  $values
     * @param  string  $boolean
     * @param  bool  $not
     * @return $this
     */
    public function whereIn($column, $values, $boolean = 'and', $not = false)
    {
        if (is_string($column) && ($column === 'nik' || str_ends_with($column, '.nik')) && is_array($values)) {
            $values = array_map(fn ($val) => is_string($val) ? User::hashNik($val) : $val, $values);
        }

        return parent::whereIn($column, $values, $boolean, $not);
    }
}
