<?php

namespace App\Models\Builders;

use App\Models\Family;
use Illuminate\Database\Eloquent\Builder;

/**
 * @template TModelClass of Family
 *
 * @extends Builder<TModelClass>
 */
class FamilyBuilder extends Builder
{
    /**
     * Add a basic where clause to the query, automatically hashing No. KK if querying the 'no_kk' column.
     *
     * @param  mixed  $column
     * @param  mixed  $operator
     * @param  mixed  $value
     * @param  string  $boolean
     * @return $this
     */
    public function where($column, $operator = null, $value = null, $boolean = 'and')
    {
        if (is_string($column) && ($column === 'no_kk' || str_ends_with($column, '.no_kk'))) {
            if (func_num_args() === 2) {
                $operator = Family::hashNoKk((string) $operator);
            } elseif ($value !== null) {
                $value = Family::hashNoKk((string) $value);
            }
        } elseif (is_array($column)) {
            foreach ($column as $key => $val) {
                if (($key === 'no_kk' || str_ends_with((string) $key, '.no_kk')) && is_string($val)) {
                    $column[$key] = Family::hashNoKk($val);
                }
            }
        }

        return parent::where($column, $operator, $value, $boolean);
    }

    /**
     * Add a "where in" clause to the query, hashing No. KK values.
     *
     * @param  string  $column
     * @param  mixed  $values
     * @param  string  $boolean
     * @param  bool  $not
     * @return $this
     */
    public function whereIn($column, $values, $boolean = 'and', $not = false)
    {
        if (is_string($column) && ($column === 'no_kk' || str_ends_with($column, '.no_kk')) && is_array($values)) {
            $values = array_map(fn ($val) => is_string($val) ? Family::hashNoKk($val) : $val, $values);
        }

        return parent::whereIn($column, $values, $boolean, $not);
    }
}
